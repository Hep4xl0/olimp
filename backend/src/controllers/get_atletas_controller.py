from src.models.atletas_model import Atleta
from src import db
from sqlalchemy import func
from flask import jsonify, request, Blueprint

get_atletas = Blueprint("get_atletas",__name__)

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


@get_atletas.route('/api/medalhas', methods=['GET'])
def obter_medalhas():
    ano_selecionado = request.args.get('ano', type=str, default="")
    pais_selecionado = request.args.get('pais', type=str, default="")

    # Obter a lista de anos válidos
    anos_validos = obter_anos_validos()

    # Contar medalhas filtradas pelo ano selecionado
    medalhas_por_pais = contar_medalhas_por_pais(ano_selecionado)

    # Obter todos os esportes
    todos_os_esportes = obter_todos_os_esportes()

    # Obter atletas com medalhas pelo país e ano selecionados, se houver
    atletas_por_pais = obter_atletas_com_medalhas_por_pais(pais_selecionado, ano_selecionado) if pais_selecionado else {}

    return jsonify({
        'medalhas': medalhas_por_pais,
        'anos_validos': anos_validos,
        'todos_os_esportes': todos_os_esportes,
        'atletas_por_pais': atletas_por_pais
    })
