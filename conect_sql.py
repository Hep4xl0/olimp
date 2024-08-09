import mysql.connector
import pandas as pd
from models import Pais, Atleta

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123123",
        database="olimpiada_sql"
    )

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

def inserir_atletas(cursor, atletas):
    for atleta in atletas:
        cursor.execute("""
        INSERT INTO atleta (id, nome, pais_id, season, esport, medalha, ano) VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE nome = VALUES(nome), pais_id = VALUES(pais_id), season = VALUES(season), esport = VALUES(esport), medalha = VALUES(medalha), ano = VALUES(ano);
        """, (atleta.id, atleta.nome, atleta.pais.id, atleta.season, atleta.esport, atleta.medalha, atleta.ano))    

def inserir_paises(cursor, pais_dict):
    for pais in pais_dict.values():
        cursor.execute("""
        INSERT INTO pais (id, nome) VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE nome = VALUES(nome);
        """, (pais.id, pais.nome))

