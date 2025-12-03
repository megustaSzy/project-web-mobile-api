import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MapPin, Calendar, Clock, Users, Search } from "lucide-react-native";

export default function SearchCard() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [tourDestination, setTourDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("1");

  const handleSearch = () => {
    console.log({ pickupLocation, tourDestination, date, time, people });
  };

  return (
    <View style={styles.card}>
      {/* Lokasi Penjemputan */}
      <View style={styles.row}>
        <MapPin size={20} color="#1A73E8" />
        <TextInput
          placeholder="Lokasi Penjemputan"
          placeholderTextColor="#888"
          style={styles.input}
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />
      </View>

      <View style={styles.divider} />

      {/* Tujuan Wisata */}
      <View style={styles.row}>
        <MapPin size={20} color="#1A73E8" />
        <TextInput
          placeholder="Tujuan Wisata"
          placeholderTextColor="#888"
          style={styles.input}
          value={tourDestination}
          onChangeText={setTourDestination}
        />
      </View>

      <View style={styles.divider} />

      {/* Tanggal */}
      <View style={styles.row}>
        <Calendar size={20} color="#1A73E8" />
        <TextInput
          placeholder="Tanggal (YYYY-MM-DD)"
          placeholderTextColor="#888"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />
      </View>

      <View style={styles.divider} />

      {/* Waktu */}
      <View style={styles.row}>
        <Clock size={20} color="#1A73E8" />
        <TextInput
          placeholder="Waktu (08:00)"
          placeholderTextColor="#888"
          style={styles.input}
          value={time}
          onChangeText={setTime}
        />
      </View>

      <View style={styles.divider} />

      {/* Jumlah Orang */}
      <View style={styles.row}>
        <Users size={20} color="#1A73E8" />
        <TextInput
          placeholder="Jumlah Orang"
          placeholderTextColor="#888"
          keyboardType="numeric"
          style={styles.input}
          value={people}
          onChangeText={setPeople}
        />
      </View>

      {/* Button Search Floating */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Search size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#eee",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  button: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1A73E8",
    borderRadius: 50,
    padding: 12,
    elevation: 5,
  },
});
