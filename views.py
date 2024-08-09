from models import *
from main import *
def filtrar_atleta_estacao(atletas, estacao):
    return [atleta for atleta in atletas if atleta.season == estacao]

def filtrar_pais_estacao(pais_dict, estacao):
    paises_filtro = {}
    for pais in pais_dict.values():
        atletas_filtro = filtrar_atleta_estacao(pais.atletas, estacao)
        if atletas_filtro:
            paises_filtrado = Pais(id=pais.id, nome=pais.nome)
            for atleta in atletas_filtro:
                paises_filtrado.adicionar_atleta(atleta)
            paises_filtro[paises_filtrado.id] = paises_filtrado
    return paises_filtro
