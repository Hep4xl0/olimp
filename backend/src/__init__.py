from flask_sqlalchemy import SQLAlchemy
from flask import Flask
# Configuração do Flask
app = Flask(__name__, template_folder='views/templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123123@localhost/olimpiada_sql'  # Substitua pelos valores apropriados
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Inicialização do SQLAlchemy
db = SQLAlchemy(app)

from src.routes import pages
app.register_blueprint(pages)
