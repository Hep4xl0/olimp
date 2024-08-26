import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
        <div className="main-box">
            <div className="year-box" ref={trackRef}>
                {dates.map((date) => (
                    <div 
                        key={date} 
                        className="year" 
                        onClick={() => setSelectedYear(date)}
                    >
                        {date}
                    </div>
                ))}
            </div>
            <div className="score">
                <h1 className="city-name">PARIS</h1>
                <div className="positions">
                    <div className="top-description">
                        <span className="description">Team</span>
                        <div className="icon-medals">
                           
                        </div>
                    </div>
                    {/* Renderiza os dados de medalhas */}
                    {Object.keys(medals).map((country, index) => (
                        <div className="classification" key={index}>
                            <div className="position">{index + 1}</div>
                            <div className="country">{country}</div>
                            <div className="results">
                                <span className="gold-medal">{medals[country].gold}</span>
                                <span className="silver-medal">{medals[country].silver}</span>
                                <span className="bronze-medal">{medals[country].bronze}</span>
                                <span className="total-medal">{medals[country].total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default City;
