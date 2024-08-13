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

def contar_medalhas_por_time(ano=None):
    query = db.session.query(
        Atleta.time,
        Atleta.medalha,
        func.count().label('total_medalhas')
    ).filter(
        Atleta.medalha != 'None'  # Ignorar entradas sem medalha
    )
    
    if ano:
        if ano != "":  # Se o ano não estiver vazio
            query = query.filter(Atleta.ano == ano)
    
    resultado = query.group_by(
        Atleta.time,
        Atleta.medalha
    ).all()

    medalhas_por_time = {}
    for time, medalha, total_medalhas in resultado:
        if time not in medalhas_por_time:
            medalhas_por_time[time] = {'Gold': 0, 'Silver': 0, 'Bronze': 0, 'Total': 0}
        
        medalhas_por_time[time][medalha] = total_medalhas
        medalhas_por_time[time]['Total'] += total_medalhas

    return medalhas_por_time

def obter_anos_validos():
    anos = db.session.query(Atleta.ano).distinct().order_by(Atleta.ano).all()
    return [ano[0] for ano in anos]

def esporte_exibir():


@app.route('/', methods=['GET'])
def index():
    ano_selecionado = request.args.get('ano', type=str, default="")
    
    # Obter a lista de anos válidos
    anos_validos = obter_anos_validos()

    # Contar medalhas filtradas pelo ano selecionado
    medalhas_por_time = contar_medalhas_por_time(ano_selecionado)
    
    return render_template('index.html', medalhas=medalhas_por_time, anos_validos=anos_validos, ano_selecionado=ano_selecionado)


if __name__ == '__main__':
    app.run()
