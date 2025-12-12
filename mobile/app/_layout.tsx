import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import BottomNavbar from '../components/BottomNavbar';
import NavBar from '../components/NavBar';
import { usePathname } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // daftar halaman yang tidak ingin menampilkan navbar
  const hideNavbarPages = ['/auth/login/page', '/auth/forgot-password/page' ,'/auth/reset-password/page'];

  const showNavbar = !hideNavbarPages.includes(pathname);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {showNavbar && <NavBar />}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>

      {showNavbar && <BottomNavbar />}

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
