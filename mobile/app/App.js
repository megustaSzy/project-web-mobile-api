import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import semua screen
// import PesananTour from "./pesanantour/page";
import Login from "./auth/login/page";
import ForgotPassword from "./auth/forgot-password/page";
import ResetPassword from "./auth/reset-password/page";
import Signup from "./auth/signup/page";
import HomeScreen from "../components/Landingpage"; // Pastikan file HomeScreen ada

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: "Daftar Akun" }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: "Lupa Password" }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ title: "Reset Password" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Beranda" }}
        />
        {/* <Stack.Screen
          name="PesananTour"
          component={PesananTour}
          options={{ title: "Pesanan Tour" }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
