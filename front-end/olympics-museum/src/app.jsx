import React from 'react';
import City from './components/City';
import Season from './components/Season';

function App() {
    return (
        <CountryProvider>
            <City />
            <Season />
        </CountryProvider>
    );
}

export default App;