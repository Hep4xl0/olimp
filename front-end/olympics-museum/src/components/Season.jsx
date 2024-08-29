import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import flame from '../images/flame.png';
import snowflake from '../images/snowflake.png';
import gold from '../images/gold.svg';
import silver from '../images/silver.svg';
import bronze from '../images/bronze.svg';
import all from '../images/all.svg';

// Estilos dos componentes (aqui mantemos a mesma estrutura para não alterar muito)

const MainBox = styled.div`
    width: 500px;
    height: 600px;
`;
const ButtonFlame = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  opacity: ${({ flameActive, snowflakeActive }) => (flameActive && !snowflakeActive ? '1' : '0.5')};
  transition: opacity 200ms ease;

  &:hover {
    opacity: ${({ flameActive, snowflakeActive }) => (flameActive && !snowflakeActive ? '1' : '0.8')};
  }
`;
const ButtonSnowflake = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  opacity: ${({ flameActive, snowflakeActive }) => (snowflakeActive && !flameActive ? '1' : '0.5')};
  transition: opacity 200ms ease;

  &:hover {
    opacity: ${({ snowflakeActive, flameActive }) => (snowflakeActive && !flameActive ? '1' : '0.8')};
  }
`;
const MomentumImg = styled.img`
    height: 55px;
`;
const MomentumBox = styled.div`
    border: solid white 2px;
    background-color: #181818;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;
const Momentum = styled.h1`
    color: white;
    font-family: montserrat;
    font-weight: 600;
    font-size: 2.5rem;
    text-align: center;
    margin: 0;
    padding: 20px;
`;
const Score = styled.div`
    user-select: none;
    height: 500px;
    background-color: #181818;
    overflow: auto;
`;
const CountryName = styled.h2`
    margin: 0;
    padding: 20px;
    color: white;
    font-family: montserrat;
    font-size: 2rem;
    font-style: italic;
    font-weight: 500;
    text-align: center;
`;
const Positions = styled.div`
    background-color: #202020;
    margin: 0px 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
`;
const TopDescription = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 0px;
`;
const IconMedals = styled.div``;
const Description = styled.p`
    color: grey;
    margin: 0;
    font-family: montserrat;
`;
const Img = styled.img`
    width: 20px;
    height: 20px;
    padding-right: 10px;
`;
const Classification = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: solid 1px grey; 
    padding: 5px 10px;
`;
const Position = styled.p`
    margin: 0;
    color: white;
    font-family: arial;
`;
const Country = styled.h3`
    color: white;
    margin: 0;
    font-family: montserrat;
    font-size: 1rem;
    font-weight: 500;
    padding: 10px 0px;
`;
const Results = styled.div`
    display: flex;
    gap: 10px;
    font-size: 1.12rem;
`;
const GoldMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const SilverMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const BronzeMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const TotalMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const PositionAthlete = styled.p`
    margin: 0;
    color: white;
    font-family: arial;
`;
const CountryAthlete = styled.h3`
    color: white;
    margin: 0;
    font-family: montserrat;
    font-size: 1rem;
    font-weight: 500;
    padding: 10px 0px;
`;
const Athlete = styled.h3`
    color: white;
    margin: 0;
    font-family: montserrat;
    font-size: 1rem;
    font-weight: 500;
    padding: 10px 0px;
`;
const GoldMedalAthlete = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const SilverMedalAthlete = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const BronzeMedalAthlete = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const TotalMedalAthlete = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`;
const DrawerButton = styled.button`
    cursor: pointer;
    margin-bottom: 10px;
    border: none;
    transition: 200ms ease;
    &:hover {
        background-color: #181818;   
    }
    background-color: ${({ isActive }) => (isActive ? '#202020' : '#181818')};
`;
const SportName = styled.h4`
    margin: -5px;
    color: white;
    font-family: montserrat;
    font-size: 1rem;
    font-weight: 500;
    padding: 15px 5px;
    text-align: left;
`;
const Drawer = styled.div`
    padding-left: 20px;
    transition: 200ms ease;
    margin-top: ${({ isActive }) => (isActive ? '0px' : '-100px')};
    z-index: ${({ isActive }) => (isActive ? '0' : '-1')};
    opacity: ${({ isActive }) => (isActive ? '1' : '0')};
`;
const TopDescriptionAthlete = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 0px;
    padding-bottom: 10px;   
`;
const ClassificationAthlete = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: solid 1px grey; 
    padding: 5px 10px;
`;

function Season() {
    const [sports, setSports] = useState([]);
    const [athletes, setAthletes] = useState({});
    const [medals, setMedals] = useState({});
    const [isActive, setIsActive] = useState(null); // Track active drawer by sport
    const [selectedSport, setSelectedSport] = useState(null);
    const [flameActive, setFlameActive] = useState(true);
    const [snowflakeActive, setSnowflakeActive] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [season, setSeason] = useState('SUMMER');

    useEffect(() => {
        // Carrega a lista de esportes
        axios.get('http://localhost:5000/esportes')
            .then(response => setSports(response.data.esportes))
            .catch(error => console.error('Erro ao carregar esportes:', error));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedSport) {
                    // Carrega medalhas
                    const medalsResponse = await axios.get(`http://localhost:5000/medalhas?ano=${selectedYear || ''}&modalidade=${selectedSport}`);
                    setMedals(medalsResponse.data.medalhas);

                    // Carrega atletas
                    const athletesResponse = await axios.get(`http://localhost:5000/atletas?ano=${selectedYear || ''}&pais=${selectedCountry || ''}&modalidade=${selectedSport}`);
                    setAthletes(athletesResponse.data.atletas);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        fetchData();
    }, [selectedYear, season, selectedCountry, selectedSport]);

    const toggleActive = (sport) => {
        if (isActive === sport) {
            setIsActive(null);
            setSelectedSport(null);
        } else {
            setIsActive(sport);
            setSelectedSport(sport);
        }
    };

    const handleFlameClick = () => {
        setFlameActive(true);
        setSnowflakeActive(false);
        setSeason("SUMMER");
    };

    const handleSnowflakeClick = () => {
        setFlameActive(false);
        setSnowflakeActive(true);
        setSeason("WINTER");
    };

    return (
        <MainBox>
            <MomentumBox>
                <ButtonFlame flameActive={flameActive} snowflakeActive={snowflakeActive} onClick={handleFlameClick}>
                    <MomentumImg src={flame} />
                </ButtonFlame>
                <h2>{season}</h2>
                <ButtonSnowflake flameActive={flameActive} snowflakeActive={snowflakeActive} onClick={handleSnowflakeClick}>
                    <MomentumImg src={snowflake} />
                </ButtonSnowflake>
            </MomentumBox>
            <Score>
                <CountryName>{selectedCountry || 'All Countries'}</CountryName>
                <Positions>
                    <TopDescription>
                        <Description>Team</Description>
                        <IconMedals>
                            <Img src={gold} />
                            <Img src={silver} />
                            <Img src={bronze} />
                            <Img src={all} />
                        </IconMedals>
                    </TopDescription>

                    {/* Renderiza os dados de medalhas */}
                    {medals[selectedCountry] && (
                        <Classification>
                            <Position>1</Position>
                            <Country>{selectedCountry}</Country>
                            <Results>
                                <GoldMedal>{medals[selectedCountry].gold} Gold</GoldMedal>
                                <SilverMedal>{medals[selectedCountry].silver} Silver</SilverMedal>
                                <BronzeMedal>{medals[selectedCountry].bronze} Bronze</BronzeMedal>
                                <TotalMedal>{medals[selectedCountry].total} Total</TotalMedal>
                            </Results>
                        </Classification>
                    )}

                    {/* Renderiza botões para cada esporte */}
                    {sports.map(sport => (
                        <DrawerButton
                            key={sport}
                            isActive={isActive === sport}
                            onClick={() => toggleActive(sport)}
                        >
                            <SportName>{sport}</SportName>
                        </DrawerButton>
                    ))}

                    {/* Renderiza o conteúdo do Drawer com base no esporte ativo */}
                    {isActive && (
                        <Drawer isActive={isActive === selectedSport}>
                            <Description>Athletes</Description>
                            <IconMedals style={{ display: 'flex' }}></IconMedals>

                            {/* Renderiza os dados dos atletas */}
                            {athletes && Object.keys(athletes).map(country =>
                                athletes[country].map((athlete, index) => (
                                    <ClassificationAthlete key={index}>
                                        <PositionAthlete>{index + 1}</PositionAthlete>
                                        <CountryAthlete>{country}</CountryAthlete>
                                        <Athlete>{athlete.nome}</Athlete>
                                        <Results>
                                            <GoldMedalAthlete>{athlete.medalha === 'Gold' ? 1 : 0} Gold</GoldMedalAthlete>
                                            <SilverMedalAthlete>{athlete.medalha === 'Silver' ? 1 : 0} Silver</SilverMedalAthlete>
                                            <BronzeMedalAthlete>{athlete.medalha === 'Bronze' ? 1 : 0} Bronze</BronzeMedalAthlete>
                                        </Results>
                                    </ClassificationAthlete>
                                ))
                            )}
                        </Drawer>
                    )}
                </Positions>
            </Score>
        </MainBox>
    );
}

export default Season;

