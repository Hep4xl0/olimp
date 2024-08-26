import React, { useState, useEffect } from 'react';
import axios from 'axios';
import City from './City';
import Season from './Season';

function Page() {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2021");  // Ano padrão
    const [season, setSeason] = useState("SUMMER");
    const [selectedCountry, setSelectedCountry] = useState("United States");

    useEffect(() => {
        // Carrega os anos válidos
        axios.get('http://localhost:5000/anos')
            .then(response => setYears(response.data.anos_validos))
            .catch(error => console.error('Erro ao carregar anos válidos:', error));
    }, []);

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    return (
        <>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#f8f9fa'
            }}>
                <h1 style={{ margin: 0 }}>OLYMPICS MUSEUM</h1>
               
            </header>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#e9ecef'
            }}>
                {/* Passando os anos e o ano selecionado para o componente City */}
                <City 
                    years={years} 
                    selectedYear={selectedYear} 
                    onYearChange={handleYearChange} 
                />
                {/* Passando o ano, estação e país selecionados para o componente Season */}
                <Season 
                    selectedYear={selectedYear} 
                    season={season} 
                    selectedCountry={selectedCountry} 
                    onSeasonChange={setSeason}
                    onCountryChange={setSelectedCountry}
                />
            </div>
            
            <footer style={{
                padding: '20px',
                backgroundColor: '#343a40',
                color: '#ffffff',
                textAlign: 'center'
            }}>
                <h1 style={{ margin: 0 }}>CREDITS</h1>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '10px'
                }}>
                    <div style={{ marginBottom: '10px' }}>
                        <h2 style={{ margin: '5px' }}>GitHub</h2>
                        <a href="https://github.com/Hep4xl0" style={{ color: '#ffffff', textDecoration: 'none' }}>@Hep4xl0</a>
                        <br />
                        <a href="https://github.com/Z4ffarani" style={{ color: '#ffffff', textDecoration: 'none' }}>@Z4ffarani</a>
                    </div>
                    <div>
                        <h2 style={{ margin: '5px' }}>LinkedIn</h2>
                        <a href="https://www.linkedin.com/in/hepp4xl0" style={{ color: '#ffffff', textDecoration: 'none' }}>Henry Paulo</a>
                        <br />
                        <a href="https://www.linkedin.com/in/kaique-zaffarani" style={{ color: '#ffffff', textDecoration: 'none' }}>Kaique Zaffarani</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Page;
