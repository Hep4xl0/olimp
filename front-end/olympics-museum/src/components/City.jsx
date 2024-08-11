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
    const trackRef = useRef(null)

    const dates = ["2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028"]

    const handleScroll = (event) => {
        if (trackRef.current) {
            event.preventDefault()
            trackRef.current.scrollLeft += event.deltaY * 10
        }
    }

    useEffect(() => {
        const trackElement = trackRef.current

        const handleMouseWheel = (event) => handleScroll(event)

        if (trackElement) {
            trackElement.addEventListener('wheel', handleMouseWheel)
        }

        return () => {
            if (trackElement) {
                trackElement.removeEventListener('wheel', handleMouseWheel);
            }
        }
    }, [])

    return (
        <MainBox>
            <YearBox ref={trackRef}>
                {dates.map((date) => (
                    <Year>
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
                            <Img src={gold} />
                            <Img src={silver} />
                            <Img src={bronze} />
                            <Img src={all} />
                        </IconMedals>
                    </TopDescription>
                    <Classification>
                        <Position>1</Position>
                        <Country>United States</Country>
                        <Results>
                            <GoldMedal>30</GoldMedal>
                            <SilverMedal>38</SilverMedal>
                            <BronzeMedal>35</BronzeMedal>
                            <TotalMedal>10</TotalMedal>
                        </Results>
                    </Classification>
                </Positions>
            </Score>
        </MainBox>
    )
}

export default City