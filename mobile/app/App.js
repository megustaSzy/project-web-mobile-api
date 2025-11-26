import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import pesanantour from './components/pesanantour/page';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPassword from './components/ResetPasswordForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PesananTour" component={PesananTour} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordForm} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
