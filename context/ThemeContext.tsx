import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** The resolved scheme ('light' | 'dark') actually applied right now */
  colorScheme: 'light' | 'dark';
  /** The user's stored preference ('light' | 'dark' | 'system') */
  preference: ColorScheme;
  /** True when the resolved scheme is dark */
  isDark: boolean;
  setPreference: (pref: ColorScheme) => void;
  /** Convenience toggle between light and dark (stores explicit preference) */
  toggleDark: () => void;
}

const STORAGE_KEY = 'theme_preference';

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  preference: 'light',
  isDark: false,
  setPreference: () => {},
  toggleDark: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  // Default to 'light' — only change when user explicitly toggles
  const [preference, setPreferenceState] = useState<ColorScheme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'light' || val === 'dark' || val === 'system') {
        setPreferenceState(val);
      }
      setIsLoaded(true);
    }).catch(() => {
      setIsLoaded(true);
    });
  }, []);

  const setPreference = (pref: ColorScheme) => {
    setPreferenceState(pref);
    AsyncStorage.setItem(STORAGE_KEY, pref);
  };

  // Only resolve after storage is loaded to avoid a flash
  const colorScheme: 'light' | 'dark' = !isLoaded
    ? 'light'
    : preference === 'system'
      ? systemScheme
      : preference;

  const isDark = colorScheme === 'dark';

  const toggleDark = () => {
    setPreference(isDark ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, preference, isDark, setPreference, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

/** Returns a reactive color palette that flips between light and dark values. */
export function useThemeColors() {
  const { isDark } = useAppTheme();
  return {
    bg:          isDark ? '#121212' : '#F5F5F0',
    card:        isDark ? '#1E1E1E' : '#FFFFFF',
    header:      isDark ? '#1A1A1A' : '#FFFFFF',
    text:        isDark ? '#ECEDEE' : '#1A1A1A',
    subText:     isDark ? '#9BA1A6' : '#6B6B6B',
    border:      isDark ? '#2C2C2C' : '#F0F0F0',
    icon:        isDark ? '#9BA1A6' : '#444444',
    inputBg:     isDark ? '#2A2A2A' : '#F2F2F2',
    navBg:       isDark ? '#1A1A1A' : '#FFFFFF',
    navBorder:   isDark ? '#2C2C2C' : '#ECECEC',
    divider:     isDark ? '#2A2A2A' : '#F5F5F5',
    statusBar:   (isDark ? 'light-content' : 'dark-content') as 'light-content' | 'dark-content',
  };
}

