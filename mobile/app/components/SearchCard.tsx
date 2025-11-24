import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MapPin, Calendar, Clock, Users } from "lucide-react-native";

export default function SearchCard() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [tourDestination, setTourDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("1");

  const handleSearch = () => {
    console.log("Searching...");
    console.log({ pickupLocation, tourDestination, date, time, people });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Form Pencarian</Text>

      {/* Lokasi Penjemputan */}
      <View style={styles.inputBox}>
        <MapPin size={20} color="#777" />
        <TextInput
          placeholder="Lokasi Penjemputan"
          style={styles.input}
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />
      </View>

      {/* Tujuan Wisata */}
      <View style={styles.inputBox}>
        <MapPin size={20} color="#777" />
        <TextInput
          placeholder="Tujuan Wisata"
          style={styles.input}
          value={tourDestination}
          onChangeText={setTourDestination}
        />
      </View>

      {/* Tanggal */}
      <View style={styles.inputBox}>
        <Calendar size={20} color="#777" />
        <TextInput
          placeholder="Tanggal (YYYY-MM-DD)"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />
      </View>

      {/* Waktu */}
      <View style={styles.inputBox}>
        <Clock size={20} color="#777" />
        <TextInput
          placeholder="Waktu (08:00)"
          style={styles.input}
          value={time}
          onChangeText={setTime}
        />
      </View>

      {/* Orang */}
      <View style={styles.inputBox}>
        <Users size={20} color="#777" />
        <TextInput
          placeholder="Jumlah Orang"
          style={styles.input}
          keyboardType="numeric"
          value={people}
          onChangeText={setPeople}
        />
      </View>

      {/* Tombol Search */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    elevation: 5,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
