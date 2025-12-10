import { View, Text, TextInput, Button } from "react-native";
import { Link } from "expo-router";

export default function Login() {
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Masuk" onPress={() => {}} />

      <Link href="/auth/register">Belum punya akun?</Link>
    </View>
  );
}
