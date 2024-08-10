import mysql.connector
from mysql.connector import Error
import pandas as pd

def conectar_bd():
    try:
        conexao = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123123',
            database='olimpiada_sql'
        )
        if conexao.is_connected():
            print("Conectado ao banco de dados MySQL")
            return conexao
    except Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
    return None

def criar_atletas_em_lote(conexao, dados_atletas):
    cursor = conexao.cursor()
    atleta_sql = """
        INSERT INTO atleta (id_atleta, nome, time, pais_id, season, esport, medalha, ano, cidade) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    atletas = []

    for _, linha in dados_atletas.iterrows():
        pais_id = linha['NOC']
        try:
            atleta = (
                int(linha['ID']),
                linha['Name'],
                linha['Team'],  # A nova coluna 'time'
                pais_id,
                linha['Season'],
                linha['Sport'],
                linha['Medal'] if pd.notna(linha['Medal']) else 'None',
                int(linha['Year']) if pd.notna(linha['Year']) else None,
                linha['City']  # A nova coluna 'cidade'
            )
            atletas.append(atleta)
        except ValueError as ve:
            print(f"Erro ao processar dados do atleta {linha['Name']}: {ve}")

    try:
        cursor.executemany(atleta_sql, atletas)
        conexao.commit()
        print("Dados dos atletas inseridos com sucesso.")
    except Error as e:
        print(f"Erro ao inserir os atletas: {e}")
    finally:
        cursor.close()

if __name__ == "__main__":
    # Carregar dados
    rota1 = 'archive/athlete_events.csv'
    
    dados_atletas = pd.read_csv(rota1)

    # Conectar ao banco de dados
    conexao = conectar_bd()
    if conexao:
        # Inserir dados dos atletas
        criar_atletas_em_lote(conexao, dados_atletas)
        # Fechar a conexão
        conexao.close()
