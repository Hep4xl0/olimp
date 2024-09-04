import React, { createContext, useState } from 'react';

export const MeuContexto = createContext();

export const MeuProvider = ({ children }) => {
    const [selectedYear, setSelectedYear] = useState("Todos");
    const [selectedCountry, setSelectedCountry] = useState(null);

    return (
        <MeuContexto.Provider value={{ selectedCountry, selectedCountry, selectedYear, setSelectedYear }}>
            {children}
        </MeuContexto.Provider>

    );
 };
