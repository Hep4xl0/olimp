CREATE TABLE pais (
    id VARCHAR(3) PRIMARY KEY,  -- 'NOC' é geralmente uma sigla de 3 caracteres
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE atleta (
    id INT PRIMARY KEY,  -- ID do atleta
    nome VARCHAR(100) NOT NULL,
    pais_id VARCHAR(3),  -- Relaciona-se com a coluna 'id' da tabela pais
    season ENUM('Summer', 'Winter') NOT NULL,  -- Assume que as estações são apenas 'Summer' ou 'Winter'
    esport VARCHAR(100) NOT NULL,
    medalha ENUM('Gold', 'Silver', 'Bronze', 'None') DEFAULT 'None',
    ano INT NOT NULL,
    FOREIGN KEY (pais_id) REFERENCES pais(id)
);
