import pandas as pd
from models import Pais, Atleta

def filtrar_atleta_estacao(atletas, estacao):
    return [atleta for atleta in atletas if atleta.season == estacao]

def filtrar_pais_estacao(pais_dict, estacao):
    paises_filtro = {}
    for pais in pais_dict.values():
        atletas_filtro = filtrar_atleta_estacao(pais.atletas, estacao)
        if atletas_filtro:
            paises_filtrado = Pais(id=pais.id, nome=pais.nome)
            for atleta in atletas_filtro:
                paises_filtrado.adicionar_atleta(atleta)
            paises_filtro[paises_filtrado.id] = paises_filtrado
    return paises_filtro

rota1 = 'archive/athlete_events.csv'
rota2 = 'archive/noc_regions.csv'

dados_atletas = pd.read_csv(rota1)
dados_paises = pd.read_csv(rota2)

# Criar um dicionário de países
pais_dict = {}
for _, linha in dados_paises.iterrows():
    pais = Pais(id=linha['NOC'], nome=linha['region'])
    pais_dict[linha['NOC']] = pais

# Criar uma lista de atletas e associá-los aos seus respectivos países
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
            ano=linha['Year']
        )
        atletas.append(atleta)
        pais.adicionar_atleta(atleta)

atleta_verao = filtrar_atleta_estacao(atletas, "Summer")
atleta_inverno = filtrar_atleta_estacao(atletas, "Winter")

paises_verao = filtrar_pais_estacao(pais_dict, "Summer")
paises_inverno = filtrar_pais_estacao(pais_dict, "Winter")

print("\nPaíses e seus atletas (Verão):")
for pais in paises_verao.values():
    print(pais)

print("\nPaíses e seus atletas (Inverno):")
for pais in paises_inverno.values():
    print(pais)

print("\nPaíses e seus atletas:")
for pais in pais_dict.values():
    print(pais)
