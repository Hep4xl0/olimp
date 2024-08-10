import pandas as pd
import mysql.connector
from mysql.connector import Error


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

def criar_tabelas(conexao):
    cursor = conexao.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Pais (
            id VARCHAR(3) PRIMARY KEY,
            nome VARCHAR(100)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Atleta (
            id INT,
            nome VARCHAR(100),
            team VARCHAR(150),
            pais_id VARCHAR(3),
            season VARCHAR(10),
            esport VARCHAR(50),
            medalha VARCHAR(20),
            ano INT,
            FOREIGN KEY (pais_id) REFERENCES Pais(id)
        )
    """)
    conexao.commit()
    cursor.close()