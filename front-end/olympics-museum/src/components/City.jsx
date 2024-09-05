import React, { useRef, useState, useEffect, useContext } from 'react'; // Importa useContext aqui
import axios from 'axios';
import styled from 'styled-components';
import gold from '../images/gold.svg';
import silver from '../images/silver.svg';
import bronze from '../images/bronze.svg';
import all from '../images/all.svg';
import { MeuContexto } from '../context/MeuContexto'; // Importa o contexto

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
    cursor: pointer;
    background-color: ${props => (props.selected ? '#333' : 'transparent')};
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

// City.jsx
function City() {
    const trackRef = useRef(null);
    const [dates, setDates] = useState([]);
    const [medals, setMedals] = useState({});
    const { selectedYear, setSelectedYear, selectedCountry, setSelectedCountry } = useContext(MeuContexto);

    const handleScroll = (event) => {
        if (trackRef.current) {
            event.preventDefault();
            const scrollAmount = event.deltaY * 0.5;
            trackRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const trackElement = trackRef.current;
        if (trackElement) {
            trackElement.addEventListener('wheel', handleScroll);
        }

        axios.get('http://localhost:5000/anos')
            .then(response => {
                const years = response.data.anos_validos;
                setDates(["Todos", ...years]);
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
                        ano: selectedYear !== "Todos" ? selectedYear : undefined
                    }
                });
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
                        selected={selectedYear === date}
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
                    {Object.keys(medals).length > 0 ? (
                        Object.keys(medals).map((country, index) => (
                            <Classification
                                key={index}
                                onClick={() => setSelectedCountry(country)}
                                selected={selectedCountry === country}
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
