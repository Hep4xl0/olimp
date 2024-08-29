// src/context/CountryContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const CountryContext = createContext();

// Componente Provider
export const CountryProvider = ({ children }) => {
    const [selectedCountry, setSelectedCountry] = useState("United States");

    return (
        <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
            {children}
        </CountryContext.Provider>
    );
};

// Hook customizado para usar o contexto
export const useCountry = () => {
    const context = useContext(CountryContext);
    if (!context) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
};
