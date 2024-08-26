import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Season() {
    const [isActive, setIsActive] = useState(false);
    const [flameActive, setFlameActive] = useState(true);
    const [snowflakeActive, setSnowflakeActive] = useState(false);
    const [season, setSeason] = useState("SUMMER");
    const [medals, setMedals] = useState({});
    const [athletes, setAthletes] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("United States");
    const [selectedYear, setSelectedYear] = useState("2021");

    useEffect(() => {
        if (selectedYear) {
            axios.get(`http://localhost:5000/medalhas?ano=${selectedYear}`)
                .then(response => setMedals(response.data.medalhas))
                .catch(error => console.error('Erro ao carregar medalhas:', error));

            axios.get(`http://localhost:5000/atletas?ano=${selectedYear}&pais=${selectedCountry}`)
                .then(response => setAthletes(response.data.atletas_por_pais))
                .catch(error => console.error('Erro ao carregar atletas:', error));
        }
    }, [selectedYear, season, selectedCountry]);

    const toggleActive = () => {
        setIsActive(!isActive);
    }

    const handleFlameClick = () => {
        setFlameActive(true);
        setSnowflakeActive(false);
        setSeason("SUMMER");
    }

    const handleSnowflakeClick = () => {
        setFlameActive(false);
        setSnowflakeActive(true);
        setSeason("WINTER");
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                    onClick={handleFlameClick}
                    style={{
                        backgroundColor: flameActive ? 'orange' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        margin: '0 10px'
                    }}
                >
                    
                </button>
                <h2>{season}</h2>
                <button
                    onClick={handleSnowflakeClick}
                    style={{
                        backgroundColor: snowflakeActive ? 'lightblue' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        margin: '0 10px'
                    }}
                >
                </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <h3>{selectedCountry}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p>Team</p>
                        <div style={{ display: 'flex' }}>
                           
                        </div>
                    </div>

                    {/* Renderiza os dados de medalhas */}
                    {medals[selectedCountry] && (
                        <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                            <p style={{ fontWeight: 'bold' }}>1</p>
                            <p>{selectedCountry}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{medals[selectedCountry].gold} Gold</span>
                                <span>{medals[selectedCountry].silver} Silver</span>
                                <span>{medals[selectedCountry].bronze} Bronze</span>
                                <span>{medals[selectedCountry].total} Total</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={toggleActive}
                        style={{
                            backgroundColor: isActive ? '#007bff' : '#6c757d',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            borderRadius: '5px'
                        }}
                    >
                        Swimming (Male)
                    </button>
                    {isActive && (
                        <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                            <p>Athlete</p>
                            <div style={{ display: 'flex' }}>
                                
                            </div>

                            {/* Renderiza os dados dos atletas */}
                            {athletes.map((athlete, index) => (
                                <div key={index} style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                                    <p style={{ fontWeight: 'bold' }}>{index + 1}</p>
                                    <p>{athlete.country}</p>
                                    <p>{athlete.name}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{athlete.gold} Gold</span>
                                        <span>{athlete.silver} Silver</span>
                                        <span>{athlete.bronze} Bronze</span>
                                        <span>{athlete.total} Total</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Season;
