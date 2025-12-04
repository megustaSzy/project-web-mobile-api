import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";

const destinations = [
  {
    id: 1,
    name: "Rio The Beach",
    location: "Kalianda",
    image: require("../../assets/images/hero1.jpg"),
    desc: "Pantai Rio The Beach menghadirkan keindahan pasir putih dan ombak tenang, cocok untuk bersantai dan menikmati suasana laut.",
    price: 120000,
  },
  {
    id: 2,
    name: "Senaya Beach",
    location: "Kalianda",
    image: require("../../assets/images/hero2.jpg"),
    desc: "Senaya Beach menawarkan panorama laut biru dan angin sejuk, tempat ideal untuk bersantai dan menikmati keindahan alam.",
    price: 120000,
  },
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    image: require("../../assets/images/hero3.jpg"),
    desc: "Green Elty Krakatoa menyajikan pemandangan laut yang menakjubkan dengan suasana tenang dan fasilitas nyaman untuk berlibur.",
    price: 120000,
  },
];

export default function PesanPage() {
  const params = useLocalSearchParams();
  const destId = Number(params.id); // ubah ke number
  const selectedDest = destinations.find((d) => d.id === destId);

  const [pickup, setPickup] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("1");

  const handleSubmit = () => {
    Alert.alert("Pesanan Berhasil!", "Pesananmu telah dikonfirmasi 🎉");
  };

  if (!selectedDest) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>🚫 Destinasi tidak ditemukan</Text>
        <Text style={styles.text}>Silakan kembali ke halaman utama untuk memilih destinasi.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={selectedDest.image} style={styles.image} />
        <Text style={styles.name}>{selectedDest.name}</Text>
        <Text style={styles.location}>{selectedDest.location}</Text>
        <Text style={styles.desc}>{selectedDest.desc}</Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>Lokasi Penjemputan</Text>
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={pickup}
            onValueChange={(itemValue) => setPickup(itemValue)}
          >
            <Picker.Item label="Pilih lokasi" value="" />
            <Picker.Item label="Terminal Rajabasa" value="Terminal Rajabasa" />
            <Picker.Item label="Terminal Kemiling" value="Terminal Kemiling" />
            <Picker.Item label="Stasiun Tanjung Karang" value="Stasiun Tanjung Karang" />
          </Picker>
        </View>

        <Text style={styles.label}>Tanggal</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Jam</Text>
        <TextInput
          style={styles.input}
          placeholder="07.00 - 16.00"
          value={time}
          onChangeText={setTime}
        />

        <Text style={styles.label}>Jumlah Tiket</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={people}
          onChangeText={setPeople}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Konfirmasi Pesanan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e0f2ff",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
  },
  location: {
    fontSize: 14,
    color: "#6b7280",
  },
  desc: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 5,
    textAlign: "center",
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#1f2937",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
