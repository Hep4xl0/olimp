from models import Atleta
from app import db
from app import app
from sqlalchemy import func

def contar_medalhas_por_pais(ano=None):
    query = db.session.query(
        Atleta.pais_id,
        Atleta.medalha,
        func.count().label('total_medalhas')
    ).filter(
        Atleta.medalha != 'None'  # Ignorar entradas sem medalha
    )
    
    if ano:
        if ano != "":  # Se o ano não estiver vazio
            query = query.filter(Atleta.ano == ano)
    
    resultado = query.group_by(
        Atleta.pais_id,
        Atleta.medalha
    ).all()

    medalhas_por_pais = {}
    for pais_id, medalha, total_medalhas in resultado:
        if pais_id not in medalhas_por_pais:
            medalhas_por_pais[pais_id] = {'Gold': 0, 'Silver': 0, 'Bronze': 0, 'Total': 0}
        
        medalhas_por_pais[pais_id][medalha] = total_medalhas
        medalhas_por_pais[pais_id]['Total'] += total_medalhas

    return medalhas_por_pais

def obter_anos_validos():
    anos = db.session.query(Atleta.ano).distinct().order_by(Atleta.ano).all()
    return [ano[0] for ano in anos]



def obter_atletas_com_medalhas_por_pais(pais_id, ano=None):
    query = db.session.query(
        Atleta.nome,
        Atleta.esport,
        Atleta.medalha,
        Atleta.ano
    ).filter(
        Atleta.pais_id == pais_id,
        Atleta.medalha != 'None'  # Filtrar apenas atletas com medalhas
    )
    
    if ano:
        if ano != "":  # Se o ano não estiver vazio
            query = query.filter(Atleta.ano == ano)

    atletas_com_medalhas = query.order_by(Atleta.esport, Atleta.nome).all()

    atletas_dict = {}
    for nome, esport, medalha, ano in atletas_com_medalhas:
        if esport not in atletas_dict:
            atletas_dict[esport] = []
        atletas_dict[esport].append((nome, medalha, ano))
    
    return atletas_dict


def obter_todos_os_esportes():
    esportes = db.session.query(Atleta.esport).distinct().order_by(Atleta.esport).all()
    return [esport[0] for esport in esportes]