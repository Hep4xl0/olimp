import pandas as pd

rota1 = 'archive/athlete_events.csv'
rota2 = 'archive/noc_regions.csv'

dados_atletas = pd.read_csv(rota1)

verao = ['Summer']
inverno = ['Winter']
atletas_verao = dados_atletas[dados_atletas['Season'].isin(verao)]
atletas_inverno = dados_atletas[dados_atletas['Season'].isin(inverno)]


medalhas = ['Gold', 'Silver', 'Bronze']

atletas_medalistas_verao = atletas_verao[atletas_verao['Medal'].isin(medalhas)]
atletas_medalistas_inverno = atletas_inverno[atletas_inverno['Medal'].isin(medalhas)]


print(atletas_medalistas_verao.head(),atletas_medalistas_inverno.head())