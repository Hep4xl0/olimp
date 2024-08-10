CREATE TABLE pais (
    id VARCHAR(3) PRIMARY KEY,  -- 'NOC' é geralmente uma sigla de 3 caracteres
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE atleta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_atleta INT,
    nome VARCHAR(300) NOT NULL,
    time VARCHAR(200) NOT NULL,
    pais_id VARCHAR(3),
    season ENUM('Summer', 'Winter') NOT NULL,
    esport VARCHAR(100) NOT NULL,
    medalha ENUM('Gold', 'Silver', 'Bronze', 'None') DEFAULT 'None',
    ano INT NOT NULL,
    cidade VARCHAR(150) NOT NULL
);