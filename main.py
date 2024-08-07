import pandas as pd
from models import Atleta


rota1 = 'archive/athlete_events.csv'
rota2 = 'archive/noc_regions.csv'

dados_atletas = pd.read_csv(rota1)

atletas = []

for _, linha in dados_atletas.iterrows():
    atleta = Atleta(
        id=int(linha['ID']),
        nome=linha['Name'],
        nacionalidade=linha['NOC'],
        season=linha['Season'],
        esport=linha['Sport'],
        medalha=linha['Medal'] if pd.notna(linha['Medal']) else 'None',
        ano=linha['Year']
    )
    atletas.append(atleta)

atletas_com_medalhas = [atleta for atleta in atletas if atleta.medalha != 'None']

# Filtrar atletas por temporada
atletas_verao = [atleta for atleta in atletas_com_medalhas if atleta.season == 'Summer']
atletas_inverno = [atleta for atleta in atletas_com_medalhas if atleta.season == 'Winter']

print("Atletas de Verão:")
for atleta in atletas_verao[:5]:  # Imprimir os primeiros 5 atletas de verão
    print(atleta)

print("\nAtletas de Inverno:")
for atleta in atletas_inverno[:5]:  # Imprimir os primeiros 5 atletas de inverno
    print(atleta)