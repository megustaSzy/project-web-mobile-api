// app/_layout.js
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import BottomNavbar from '../components/BottomNavbar';
import NavBar from '../components/NavBar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Top Navbar custom */}
      <NavBar />

      {/* Stack untuk semua halaman */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tidak memanggil (tabs) lagi, supaya header/tab default hilang */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="modal" 
          options={{ presentation: 'modal', headerShown: false }} 
        />
      </Stack>

      {/* Bottom Navbar custom */}
      <BottomNavbar />

      {/* StatusBar */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
