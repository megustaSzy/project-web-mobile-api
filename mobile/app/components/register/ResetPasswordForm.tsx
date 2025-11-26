import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ForgotPasswordForm from "../../components/register/ForgotPasswordForm";
import ResetPasswordForm from "../../components/register/ResetPasswordForm";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordForm} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
