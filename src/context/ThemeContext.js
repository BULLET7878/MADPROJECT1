import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? {
            background: '#121212',
            text: '#e0e0e0',
            card: '#1e1e1e',
            primary: '#90caf9',
            border: '#333',
            danger: '#cf6679',
            success: '#81c784'
        } : {
            background: '#f5f5f5',
            text: '#333',
            card: '#ffffff',
            primary: '#2196f3',
            border: '#ddd',
            danger: '#f44336',
            success: '#4caf50'
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
