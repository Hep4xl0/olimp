from flask import Blueprint

from src.controllers.get_atletas_controller import get_atletas
pages = Blueprint('pages',__name__)
pages.register_blueprint(get_atletas)

