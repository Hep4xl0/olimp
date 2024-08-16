import styled from 'styled-components'
import OlympicsImage from '../images/Olympics.png'
import City from './City.jsx'
import Season from './Season.jsx'

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
    return (
        <>
            <Header>
                <Title>OLYMPICS MUSEUM</Title>
                <Logo src={OlympicsImage} alt='Olympics Image'/>
            </Header>

            <Windows>
                <City />
                <Season />
            </Windows>
            
            <Footer>
                <Title>CREDITS</Title>
                <Websites>
                    <Names>
                        <SubTitle>GitHub</SubTitle>
                        <Link href="https://github.com/Hep4xl0">@Hep4xl0</Link>
                        <Link href="https://github.com/Z4ffarani">@Z4ffarani</Link>
                    </Names>
                    <Names>
                        <SubTitle>LinkedIn</SubTitle>
                        <Link href="https://www.linkedin.com/in/hepp4xl0">Henry Paulo</Link>
                        <Link href="https://www.linkedin.com/in/kaique-zaffarani">Kaique Zaffarani</Link>
                    </Names>
                </Websites>
            </Footer>
        </>
    )
}

export default Page

