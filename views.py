from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

# Configuração do Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123123@localhost/olimpiada_sql'  # Substitua pelos valores apropriados
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização do SQLAlchemy
db = SQLAlchemy(app)

class Atleta(db.Model):
    __tablename__ = 'atleta'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_atleta = db.Column(db.Integer)
    nome = db.Column(db.String(300), nullable=False)
    time = db.Column(db.String(200), nullable=False)
    pais_id = db.Column(db.String(3))
    season = db.Column(db.Enum('Summer', 'Winter'), nullable=False)
    esport = db.Column(db.String(100), nullable=False)
    medalha = db.Column(db.Enum('Gold', 'Silver', 'Bronze', 'None'), default='None')
    ano = db.Column(db.Integer, nullable=False)
    cidade = db.Column(db.String(150), nullable=False)

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

def obter_esportes_por_ano(ano=None):
    query = db.session.query(
        Atleta.ano,
        Atleta.esport
    ).distinct().order_by(Atleta.ano, Atleta.esport)

    if ano:
        if ano != "":  # Se o ano não estiver vazio
            query = query.filter(Atleta.ano == ano)

    esportes_por_ano = query.all()

    esportes_dict = {}
    for ano, esport in esportes_por_ano:
        if ano not in esportes_dict:
            esportes_dict[ano] = []
        esportes_dict[ano].append(esport)
    
    return esportes_dict

def obter_atletas_por_pais(pais_id, ano=None):
    query = db.session.query(
        Atleta.nome,
        Atleta.esport,
        Atleta.medalha,
        Atleta.ano
    ).filter(
        Atleta.pais_id == pais_id
    )
    
    if ano:
        if ano != "":  # Se o ano não estiver vazio
            query = query.filter(Atleta.ano == ano)

    atletas_por_pais = query.order_by(Atleta.esport, Atleta.nome).all()

    atletas_dict = {}
    for nome, esport, medalha, ano in atletas_por_pais:
        if esport not in atletas_dict:
            atletas_dict[esport] = []
        atletas_dict[esport].append((nome, medalha, ano))
    
    return atletas_dict

@app.route('/', methods=['GET'])
def index():
    ano_selecionado = request.args.get('ano', type=str, default="")
    pais_selecionado = request.args.get('pais', type=str, default="")

    # Obter a lista de anos válidos
    anos_validos = obter_anos_validos()

    # Contar medalhas filtradas pelo ano selecionado
    medalhas_por_pais = contar_medalhas_por_pais(ano_selecionado)

    # Obter esportes por ano, filtrando pelo ano selecionado
    esportes_por_ano = obter_esportes_por_ano(ano_selecionado)

    # Obter atletas pelo país e ano selecionados, se houver
    atletas_por_pais = obter_atletas_por_pais(pais_selecionado, ano_selecionado) if pais_selecionado else {}

    return render_template('index.html', medalhas=medalhas_por_pais, anos_validos=anos_validos, ano_selecionado=ano_selecionado, esportes_por_ano=esportes_por_ano, atletas_por_pais=atletas_por_pais, pais_selecionado=pais_selecionado)

if __name__ == '__main__':
    app.run()
