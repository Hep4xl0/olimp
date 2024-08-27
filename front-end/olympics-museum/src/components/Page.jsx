import React, { useState, useEffect } from 'react';
import axios from 'axios';
import City from './City';
import Season from './Season';

const Header = styled.header`
    background: linear-gradient(90deg, #0040E5, #2D0051);
    display: flex;
    padding: 35px;
    align-items: center;
    justify-content: space-between;
`
const Title = styled.h1`
    user-select: none;
    margin: 0;
    color: white;
    font-size: 2.5rem;
    font-family: montserrat;
    font-weight: 550;
`
const Logo = styled.img`
    width: 105px;
    height: 45px;
`
const Footer = styled.footer`
background-color: #181818;
    display: flex;
    flex-direction: column;
    padding: 35px;
    align-items: center;
`
const Websites = styled.div`
    display: flex;
    gap: 100px;
`
const Names = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const SubTitle = styled.h2`
    user-select: none;
    margin-bottom: 10px;
    color: white;
    font-size: 2rem;
    font-family: montserrat;
    font-weight: 450;
`
const Link = styled.a`
    color: white;
    margin: 5px 0px;
    font-family: montserrat;
    font-weight: 400;
    text-decoration-line: none;
    opacity: 0.5;
    transition: 200ms ease;
    &:hover {
        opacity: 1;
    }
    &:active {
        scale: 95%;
    }
`
const Windows = styled.div`
    display: flex;
    flex-direction: row;
    padding: 40px;
    gap: 45px;
    justify-content: center;
`

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
            <Header>
                <Title>OLYMPICS MUSEUM</Title>
                <Logo src={OlympucsImage} alt='Olympics Image'/>
            </Header>

            <Windows>
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
            </Windows>
            
            <Footer>
                <Title>CREDITS</Title>
                <Websites>
                    <Names>
                        <SubTitle>GitHub</SubTitle>
                        <Link href="https://github.com/Hep4xl0" style={{ color: '#ffffff', textDecoration: 'none' }}>@Hep4xl0</Link>
                        <Link href="https://github.com/Z4ffarani" style={{ color: '#ffffff', textDecoration: 'none' }}>@Z4ffarani</Link>
                    </Names>
                    <Names>
                        <SubTitle>LinkedIn</SubTitle>
                        <Link href="https://www.linkedin.com/in/hepp4xl0" style={{ color: '#ffffff', textDecoration: 'none' }}>Henry Paulo</Link>
                        <Link href="https://www.linkedin.com/in/kaique-zaffarani" style={{ color: '#ffffff', textDecoration: 'none' }}>Kaique Zaffarani</Link>
                    </Names>
                </Websites>
            </Footer>
        </>
    );
}

export default Page;
