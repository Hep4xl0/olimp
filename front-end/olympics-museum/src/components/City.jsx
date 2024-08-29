import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import gold from '../images/gold.svg';
import silver from '../images/silver.svg';
import bronze from '../images/bronze.svg';
import all from '../images/all.svg';

const MainBox = styled.div`
    width: 500px;
    height: 600px;
`;
const YearBox = styled.div`
    cursor: grab;
    border: solid 2px white;
    background-color: #181818;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    white-space: nowrap;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
`;
const Year = styled.button`
    cursor: pointer;
    user-select: none;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 2.5rem;
    text-align: center;
    border: none;
    background: none;
    margin: 0;
    padding: 20px;
    transition: 200ms ease;
    opacity: 0.5;
    scroll-snap-align: start;
    &:hover {
        opacity: 1;
    }
    font-weight: ${props => (props.selected ? 'bold' : 'normal')};
    background-color: ${props => (props.selected ? '#333' : 'transparent')};
`;
const Score = styled.div`
    user-select: none;
    height: 500px;
    background-color: #181818;
    overflow: auto;
`;
const CityName = styled.h2`
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
const IconMedals = styled.div`
    display: flex;
    align-items: center;
`;
const Description = styled.p`
    color: grey;
    margin: 0;
    font-family: montserrat;
    padding-bottom: 10px;
`;
const Img = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 10px;
`;
const Classification = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: solid 1px grey; 
    padding: 5px 10px;
    cursor: pointer; /* Adiciona cursor de clique */
    background-color: ${props => (props.selected ? '#333' : 'transparent')}; /* Destaca país selecionado */
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
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-size: 1.12rem;
`;
const MedalCount = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: white;
    font-family: montserrat;
`;

function City() {
    const trackRef = useRef(null);
    const [dates, setDates] = useState([]);
    const [medals, setMedals] = useState({});
    const [selectedYear, setSelectedYear] = useState("Todos");
    const [selectedCountry, setSelectedCountry] = useState(null); // Estado para o país selecionado

    const handleScroll = (event) => {
        if (trackRef.current) {
            event.preventDefault();
            const scrollAmount = event.deltaY * 0.5; // Ajuste a quantidade de rolagem
            trackRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth' // Suaviza a rolagem
            });
        }
    };

    useEffect(() => {
        const trackElement = trackRef.current;

        if (trackElement) {
            trackElement.addEventListener('wheel', handleScroll);
        }

        // Carregar os anos válidos da API
        axios.get('http://localhost:5000/anos')
            .then(response => {
                const years = response.data.anos_validos;
                console.log('Anos recebidos da API:', years); // Debug: Verifique os anos recebidos
                setDates(["Todos", ...years]); // Adiciona a opção "Todos"
            })
            .catch(error => console.error('Erro ao carregar anos:', error));

        return () => {
            if (trackElement) {
                trackElement.removeEventListener('wheel', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        const fetchMedals = async () => {
            try {
                const response = await axios.get('http://localhost:5000/medalhas', {
                    params: {
                        ano: selectedYear === "Todos" ? null : selectedYear
                    }
                });
                console.log('Medalhas recebidas da API:', response.data.medalhas); // Debug: Verifique os dados recebidos
                setMedals(response.data.medalhas);
            } catch (error) {
                console.error('Erro ao carregar medalhas:', error);
            }
        };

        fetchMedals();
    }, [selectedYear]);

    return (
        <MainBox>
            <YearBox ref={trackRef}>
                {dates.map((date) => (
                    <Year 
                        key={date} 
                        onClick={() => setSelectedYear(date)}
                        selected={selectedYear === date} // Adiciona a propriedade `selected`
                    >
                        {date}
                    </Year>
                ))}
            </YearBox>
            <Score>
                <CityName>{selectedYear === "Todos" ? "All Years" : selectedYear}</CityName>
                <Positions>
                    <TopDescription>
                        <Description>Team</Description>
                        <IconMedals>
                            <Img src={gold} alt="Gold Medal"/>
                            <Img src={silver} alt="Silver Medal"/>
                            <Img src={bronze} alt="Bronze Medal"/>
                            <Img src={all} alt="All Medals"/>
                        </IconMedals>
                    </TopDescription>
                    {/* Renderiza os dados de medalhas */}
                    {Object.keys(medals).length > 0 ? (
                        Object.keys(medals).map((country, index) => (
                            <Classification
                                key={index}
                                onClick={() => setSelectedCountry(country)} // Define o país selecionado ao clicar
                                selected={selectedCountry === country} // Adiciona a propriedade `selected`
                            >
                                <Position>{index + 1}</Position>
                                <Country>{country}</Country>
                                <Results>
                                    <MedalCount>
                                        <Img src={gold} alt="Gold Medal"/>
                                        <p>{medals[country].Gold}</p>
                                    </MedalCount>
                                    <MedalCount>
                                        <Img src={silver} alt="Silver Medal"/>
                                        <p>{medals[country].Silver}</p>
                                    </MedalCount>
                                    <MedalCount>
                                        <Img src={bronze} alt="Bronze Medal"/>
                                        <p>{medals[country].Bronze}</p>
                                    </MedalCount>
                                    <MedalCount>
                                        <Img src={all} alt="All Medals"/>
                                        <p>{medals[country].Total}</p>
                                    </MedalCount>
                                </Results>
                            </Classification>
                        ))
                    ) : (
                        <p>No data available</p>
                    )}
                </Positions>
            </Score>
        </MainBox>
    );
}

export default City;
