import { View, Text, TextInput, Button } from "react-native";
import { Link } from "expo-router";

export default function Register() {
  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Nama Lengkap" />
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Daftar" onPress={() => {}} />

      <Link href="/auth/login">Sudah punya akun?</Link>
    </View>
  );
}
