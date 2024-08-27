import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import styled from 'styled-components'
import { useRef, useEffect } from 'react';
import gold from '../images/gold.svg'
import silver from '../images/silver.svg'
import bronze from '../images/bronze.svg'
import all from '../images/all.svg'

const MainBox = styled.div`
    width: 500px;
    height: 600px;
`
const YearBox = styled.div`
    cursor: grab;
    border: solid 2px white;
    background-color: #181818;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow: auto;
    white-space: nowrap;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
`
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
    &:hover {
        opacity: 1;
    }
`
const Score = styled.div`
    user-select: none;
    height: 500px;
    background-color: #181818;
    overflow: auto;
`
const CityName = styled.h2`
    margin: 0;
    padding: 20px;
    color: white;
    font-family: montserrat;
    font-size: 2rem;
    font-style: italic;
    font-weight: 500;
    text-align: center;
`
const Positions = styled.div`
    background-color: #202020;
    margin: 0px 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
`
const TopDescription = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 0px;
`
const IconMedals = styled.div`
`
const Description = styled.p`
    color: grey;
    margin: 0;
    font-family: montserrat;
    padding-bottom: 10px;
`
const Img = styled.img`
    width: 20px;
    height: 20px;
    padding-right: 10px;
`
const Classification = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: solid 1px grey; 
    padding: 5px 10px;
`
const Position = styled.p`
    margin: 0;
    color: white;
    font-family: arial;
`
const Country = styled.h3`
    color: white;
    margin: 0;
    font-family: montserrat;
    font-size: 1rem;
    font-weight: 500;
    padding: 10px 0px;
`
const Results = styled.div`
    display: flex;
    gap: 10px;
    font-size: 1.12rem;
`
const GoldMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`
const SilverMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`
const BronzeMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`
const TotalMedal = styled.p`
    margin: 0;
    color: white;
    font-family: montserrat;
`

function City() {
    const trackRef = useRef(null);
    const [dates, setDates] = useState([]);
    const [medals, setMedals] = useState({});
    const [selectedYear, setSelectedYear] = useState("");

    const handleScroll = (event) => {
        if (trackRef.current) {
            event.preventDefault();
            trackRef.current.scrollLeft += event.deltaY * 10;
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
                setDates(response.data.anos_validos);
                setSelectedYear(response.data.anos_validos[0]); // Seleciona o primeiro ano por padrão
            })
            .catch(error => console.error('Erro ao carregar anos:', error));

        return () => {
            if (trackElement) {
                trackElement.removeEventListener('wheel', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        if (selectedYear) {
            // Carregar as medalhas para o ano selecionado
            axios.get(`http://localhost:5000/medalhas?ano=${selectedYear}`)
                .then(response => setMedals(response.data.medalhas))
                .catch(error => console.error('Erro ao carregar medalhas:', error));
        }
    }, [selectedYear]);

    return (
        <MainBox>
            <YearBox ref={trackRef}>
                {dates.map((date) => (
                    <Year 
                        key={date} 
                        className="year" 
                        onClick={() => setSelectedYear(date)}
                    >
                        {date}
                    </Year>
                ))}
            </YearBox>
            <Score>
                <CityName>PARIS</CityName>
                <Positions>
                    <TopDescription>
                        <Description>Team</Description>
                        <IconMedals>
                           <Img scr={gold}></Img>
                           <Img scr={silver}></Img>
                           <Img scr={bronze}></Img>
                           <Img scr={all}></Img>
                        </IconMedals>
                    </TopDescription>
                    {/* Renderiza os dados de medalhas */}
                    {Object.keys(medals).map((country, index) => (
                        <Classification key={index}>
                            <Position>{index + 1}</Position>
                            <Country>{country}</Country>
                            <Results>
                                <GoldMedal>{medals[country].gold}</GoldMedal>
                                <SilverMedal>{medals[country].silver}</SilverMedal>
                                <BronzeMedal>{medals[country].bronze}</BronzeMedal>
                                <TotalMedal>{medals[country].total}</TotalMedal>
                            </Results>
                        </Classification>
                    ))}
                </Positions>
            </Score>
        </MainBox>
    );
}

export default City;
