import pandas as pd
import mysql.connector
from mysql.connector import Error

def carregar_dados():
    rota1 = 'archive/athlete_events.csv'
    rota2 = 'archive/noc_regions.csv'

    dados_atletas = pd.read_csv(rota1)
    dados_paises = pd.read_csv(rota2)
    return dados_atletas, dados_paises

def criar_paises(conexao, dados_paises):
    cursor = conexao.cursor()
    pais_dict = {}
    nocs_inseridos = set()

    for _, linha in dados_paises.iterrows():
        noc = linha['NOC'] if pd.notna(linha['NOC']) else 'Unknown'
        region = linha['region'] if pd.notna(linha['region']) else 'Unknown'

        if noc not in nocs_inseridos:
            try:
                cursor.execute("INSERT INTO Pais (id, nome) VALUES (%s, %s)", (noc, region))
                pais = Pais(id=noc, nome=region)
                pais_dict[noc] = pais
                nocs_inseridos.add(noc)
            except Error as e:
                print(f"Erro ao inserir o país {noc}: {e}")

    conexao.commit()
    cursor.close()
    return pais_dict

def criar_atletas(conexao, dados_atletas, pais_dict):
    cursor = conexao.cursor()
    atleta_sql = """
        INSERT INTO Atleta (id, nome, pais_id, season, esporte, medalha, ano) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    atletas = []

    for _, linha in dados_atletas.iterrows():
        if linha['NOC'] in pais_dict:
            pais = pais_dict[linha['NOC']]
            atleta = Atleta(
                id=int(linha['ID']),
                nome=linha['Name'],
                pais=pais,
                season=linha['Season'],
                esport=linha['Sport'],
                medalha=linha['Medal'] if pd.notna(linha['Medal']) else 'None',
                ano=int(linha['Year']) if pd.notna(linha['Year']) else None
            )
            atletas.append((atleta.id, atleta.nome, atleta.pais.id, atleta.season, atleta.esport, atleta.medalha, atleta.ano))
            pais.adicionar_atleta(atleta)

    try:
        cursor.executemany(atleta_sql, atletas)
        conexao.commit()
        print("Dados dos atletas inseridos com sucesso.")
    except Error as e:
        print(f"Erro ao inserir os atletas: {e}")
    finally:
        cursor.close()

def filtrar_atleta_estacao(atletas, estacao):
    return [atleta for atleta in atletas if atleta.season == estacao]

def filtrar_pais_estacao(pais_dict, estacao):
    paises_filtro = {}
    for pais in pais_dict.values():
        atletas_filtro = filtrar_atleta_estacao(pais.atletas, estacao)
        if atletas_filtro:
            pais_filtrado = Pais(id=pais.id, nome=pais.nome)
            for atleta in atletas_filtro:
                pais_filtrado.adicionar_atleta(atleta)
            paises_filtro[pais_filtrado.id] = pais_filtrado
    return paises_filtro