import mysql.connector
import pandas as pd
from models import Pais, Atleta

# Conectar ao banco de dados MySQL
def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123123",
        database="olimpiada_sql"
    )

# Função para criar as tabelas no MySQL
def criar_tabelas(cursor):
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pais (
        id VARCHAR(3) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS atleta (
        id INT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        pais_id VARCHAR(3),
        season ENUM('Summer', 'Winter') NOT NULL,
        esport VARCHAR(100) NOT NULL,
        medalha ENUM('Gold', 'Silver', 'Bronze', 'None') DEFAULT 'None',
        ano INT NOT NULL,
        FOREIGN KEY (pais_id) REFERENCES pais(id)
    );
    """)

# Função para inserir dados na tabela 'pais'
def inserir_paises(cursor, pais_dict):
    for pais in pais_dict.values():
        cursor.execute("""
        INSERT INTO pais (id, nome) VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE nome = VALUES(nome);
        """, (pais.id, pais.nome))

# Função para inserir dados na tabela 'atleta'
def inserir_atletas(cursor, atletas):
    for atleta in atletas:
        cursor.execute("""
        INSERT INTO atleta (id, nome, pais_id, season, esport, medalha, ano) VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE nome = VALUES(nome), pais_id = VALUES(pais_id), season = VALUES(season), esport = VALUES(esport), medalha = VALUES(medalha), ano = VALUES(ano);
        """, (atleta.id, atleta.nome, atleta.pais.id, atleta.season, atleta.esport, atleta.medalha, atleta.ano))

# Função principal
def main():
    # Conectar ao banco de dados
    db = conectar_bd()
    cursor = db.cursor()
    
    # Criar tabelas
    criar_tabelas(cursor)
    
    # Ler dados
    rota1 = 'archive/athlete_events.csv'
    rota2 = 'archive/noc_regions.csv'
    dados_atletas = pd.read_csv(rota1)
    dados_paises = pd.read_csv(rota2)
    
    # Verificar dados carregados
    print("Dados Atletas:")
    print(dados_atletas.head())
    
    print("Dados Países:")
    print(dados_paises.head())
    
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
    
    # Inserir dados no banco de dados
    inserir_paises(cursor, pais_dict)
    inserir_atletas(cursor, atletas)
    
    # Commit e fechamento
    db.commit()
    cursor.close()
    db.close()

# Executar a função principal
if __name__ == "__main__":
    main()
