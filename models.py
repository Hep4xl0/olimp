from app import db
from app import app
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
