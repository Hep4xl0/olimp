
class Atleta:
    def __init__(self, id, nome, pais, season, esport, medalha, ano):
        self.id = id
        self.nome = nome
        self.pais = pais
        self.season = season
        self.esport = esport
        self.medalha = medalha
        self.ano = ano
        self.medalhas = {'Gold': 0, 'Silver': 0, 'Bronze': 0}

        if medalha in self.medalhas:
            self.medalhas[medalha] += 1

    def __str__(self):
        return f"{self.nome} ({self.pais.nome}) - Medalhas: {self.medalhas}"


class Pais:
    def __init__(self, id, nome):
        self.id = id
        self.nome = nome
        self.atletas = []
        self.medalhas = {'Gold': 0, 'Silver': 0, 'Bronze': 0}

    def adicionar_atleta(self, atleta):
        self.atletas.append(atleta)
        for tipo_medalha, quantidade in atleta.medalhas.items():
            self.medalhas[tipo_medalha] += quantidade

    def __str__(self):
        return f"{self.nome} - Medalhas: {self.medalhas}"