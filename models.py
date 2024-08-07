class Atleta:
    def __init__(self, id: int, nome: str, nacionalidade: str, season: str, esport: str, medalha: str, ano: str):
        self.id = id
        self.nome = nome
        self.nacionalidade = nacionalidade
        self.season = season
        self.esport = esport
        self.medalha = medalha
        self.ano = ano
    def __str__(self) -> str:
        return (f"ID: {self.id}, Nome: {self.nome}, Nacionalidade: {self.nacionalidade}, "
                f"Temporada: {self.season}, Esporte: {self.esport}, Medalha: {self.medalha}, Ano: {self.ano}")
