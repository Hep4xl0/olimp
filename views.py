
from flask import render_template, request
from helpers import *
from models import *
from app import app
# Configuração do Flask


@app.route('/', methods=['GET'])
def index():
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

    return render_template('index.html', medalhas=medalhas_por_pais, anos_validos=anos_validos, ano_selecionado=ano_selecionado, todos_os_esportes=todos_os_esportes, atletas_por_pais=atletas_por_pais, pais_selecionado=pais_selecionado)


