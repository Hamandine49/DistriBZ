import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
  textOnPrimary: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#3B82F6',    // Blue
    secondary: '#8B5CF6',  // Purple
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    notification: '#EF4444',
    error: '#EF4444',       // Red
    success: '#10B981',     // Green
    warning: '#F59E0B',     // Yellow
    info: '#60A5FA',        // Light Blue
    disabled: '#9CA3AF',
    textOnPrimary: '#FFFFFF',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#3B82F6',    // Blue
    secondary: '#8B5CF6',  // Purple
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    notification: '#EF4444',
    error: '#F87171',       // Light Red
    success: '#34D399',     // Light Green
    warning: '#FBBF24',     // Light Yellow
    info: '#93C5FD',        // Very Light Blue
    disabled: '#6B7280',
    textOnPrimary: '#FFFFFF',
  },
};

// Create context
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  toggleTheme: () => {},
  isDarkMode: false,
});

// Create provider
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === 'dark');

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // Use system preference if no saved preference
          setIsDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };

    saveThemePreference();
  }, [isDarkMode]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Use the appropriate theme based on dark mode setting
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);