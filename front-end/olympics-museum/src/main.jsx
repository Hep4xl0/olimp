import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import Page from './components/Page.jsx'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: #202020;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  ::-webkit-scrollbar-thumb {
    background: #555;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <Page />
  </StrictMode>
)
