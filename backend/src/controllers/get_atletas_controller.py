from src.models.atletas_models import Atleta
from src import db
from sqlalchemy import func
from flask import jsonify, request, Blueprint
from sqlalchemy.exc import SQLAlchemyError

# Criar um Blueprint para as rotas relacionadas aos atletas
get_atletas = Blueprint("get_atletas", __name__)

# Função auxiliar para contar medalhas por país
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

# Função auxiliar para obter anos válidos
def obter_anos_validos():
    anos = db.session.query(Atleta.ano).distinct().order_by(Atleta.ano).all()
    return [ano[0] for ano in anos]

# Função auxiliar para obter atletas com medalhas por país e ano
def obter_atletas_com_medalhas_por_pais(pais_id, ano=None, modalidade=None):
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

    if modalidade:
        if modalidade != "":  # Se a modalidade não estiver vazia
            query = query.filter(Atleta.esport == modalidade)

    atletas_com_medalhas = query.order_by(Atleta.esport, Atleta.nome).all()

    atletas_dict = {}
    for nome, esport, medalha, ano in atletas_com_medalhas:
        if esport not in atletas_dict:
            atletas_dict[esport] = []
        atletas_dict[esport].append((nome, medalha, ano))
    
    return atletas_dict

# Função auxiliar para obter todos os esportes
def obter_todos_os_esportes():
    esportes = db.session.query(Atleta.esport).distinct().order_by(Atleta.esport).all()
    return [esport[0] for esport in esportes]

# Função auxiliar para obter todos os atletas com filtros opcionais
def obter_todos_os_atletas(ano=None, pais=None, modalidade=None):
    query = db.session.query(
        Atleta.nome,
        Atleta.esport,
        Atleta.medalha,
        Atleta.ano,
        Atleta.pais_id
    )

    if ano:
        if ano != "":
            query = query.filter(Atleta.ano == ano)

    if pais:
        if pais != "":
            query = query.filter(Atleta.pais_id == pais)

    if modalidade:
        if modalidade != "":
            query = query.filter(Atleta.esport == modalidade)

    atletas = query.order_by(Atleta.nome).all()

    atletas_lista = []
    for nome, esport, medalha, ano, pais_id in atletas:
        atletas_lista.append({
            'nome': nome,
            'esport': esport,
            'medalha': medalha,
            'ano': ano,
            'pais_id': pais_id
        })

    return atletas_lista

# Função auxiliar para obter atletas organizados por esporte
def obter_atletas_por_esporte(ano=None, pais=None, modalidade=None):
    query = db.session.query(
        Atleta.nome,
        Atleta.esport,
        Atleta.medalha,
        Atleta.ano
    ).filter(
        Atleta.medalha != 'None'
    )
    
    if ano:
        if ano != "":
            query = query.filter(Atleta.ano == ano)

    if pais:
        if pais != "":
            query = query.filter(Atleta.pais_id == pais)

    if modalidade:
        if modalidade != "":
            query = query.filter(Atleta.esport == modalidade)

    atletas = query.order_by(Atleta.esport, Atleta.nome).all()

    atletas_por_esporte = {}
    for nome, esport, medalha, ano in atletas:
        if esport not in atletas_por_esporte:
            atletas_por_esporte[esport] = []
        atletas_por_esporte[esport].append({
            'nome': nome,
            'medalha': medalha,
            'ano': ano
        })
    
    return atletas_por_esporte


# Rota para obter medalhas por país e ano
@get_atletas.route('/medalhas', methods=['GET'])
def medalhas():
    ano_selecionado = request.args.get('ano', type=str, default="")
    
    try:
        medalhas_por_pais = contar_medalhas_por_pais(ano_selecionado)
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(medalhas=medalhas_por_pais)

@get_atletas.route('/atletas', methods=['GET'])
def atletas():
    ano_selecionado = request.args.get('ano', type=str, default="")
    pais_selecionado = request.args.get('pais', type=str, default="")
    modalidade_selecionada = request.args.get('modalidade', type=str, default="")

    try:
        # Obter todos os atletas organizados por esporte
        atletas = obter_atletas_por_esporte(ano_selecionado, pais_selecionado, modalidade_selecionada)
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

    # Retornar a lista de atletas organizados por esporte
    return jsonify(atletas=atletas)

@get_atletas.route('/esportes', methods=['GET'])
def esportes():
    try:
        todos_os_esportes = obter_todos_os_esportes()
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify(esportes=todos_os_esportes)

@get_atletas.route('/anos', methods=['GET'])
def anos():
    try:
        anos_validos = obter_anos_validos()
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify(anos_validos=anos_validos)

@get_atletas.route('/', methods=['GET'])
def index():
    ano_selecionado = request.args.get('ano', type=str, default="")
    pais_selecionado = request.args.get('pais', type=str, default="")
    
    try:
        medalhas_por_pais = contar_medalhas_por_pais(ano_selecionado)
        anos_validos = obter_anos_validos()
        todos_os_esportes = obter_todos_os_esportes()
        atletas_por_pais = obter_atletas_com_medalhas_por_pais(pais_selecionado, ano_selecionado) if pais_selecionado else {}
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify(medalhas=medalhas_por_pais, anos_validos=anos_validos, ano_selecionado=ano_selecionado, todos_os_esportes=todos_os_esportes, atletas_por_pais=atletas_por_pais, pais_selecionado=pais_selecionado)
