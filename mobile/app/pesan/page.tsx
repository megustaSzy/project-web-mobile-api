import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const destinations = [
  {
    id: 1,
    name: "Rio The Beach",
    location: "Kalianda",
    image: require("../../assets/images/hero1.jpg"),
    desc: "Pantai Rio The Beach menghadirkan keindahan pasir putih dan ombak tenang.",
    price: 120000,
  },
  {
    id: 2,
    name: "Senaya Beach",
    location: "Kalianda",
    image: require("../../assets/images/hero2.jpg"),
    desc: "Senaya Beach menawarkan panorama laut biru dan angin sejuk.",
    price: 120000,
  },
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    image: require("../../assets/images/hero3.jpg"),
    desc: "Green Elty Krakatoa menyajikan pemandangan laut yang menakjubkan.",
    price: 120000,
  },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function PesanPage() {
  const params = useLocalSearchParams();
  const destId = Number(params.id);
  const selected = destinations.find((d) => d.id === destId);

  const [pickup, setPickup] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [people, setPeople] = useState<string>("1");

  // show pickers
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);

  // for controlled DateTimePicker value
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());

  const handleSubmit = () => {
    // basic validation
    if (!pickup) {
      Alert.alert("Lengkapi data", "Pilih lokasi penjemputan.");
      return;
    }
    if (!date) {
      Alert.alert("Lengkapi data", "Pilih tanggal penjemputan.");
      return;
    }
    if (!time) {
      Alert.alert("Lengkapi data", "Pilih jam penjemputan.");
      return;
    }
    if (!people || Number(people) <= 0) {
      Alert.alert("Jumlah tiket tidak valid", "Masukkan jumlah tiket minimal 1.");
      return;
    }

    Alert.alert("Berhasil!", "Pesanan kamu telah dikonfirmasi 🎉");
  };

  // date picker handler
  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDate(Platform.OS === "ios"); // keep open on iOS, close on Android
    if (selectedDate) {
      setTempDate(selectedDate);
      const iso = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      setDate(iso);
    }
  };

  // time picker handler
  const onChangeTime = (_event: any, selectedTime?: Date) => {
    setShowTime(Platform.OS === "ios");
    if (selectedTime) {
      setTempTime(selectedTime);
      const hh = selectedTime.getHours().toString().padStart(2, "0");
      const mm = selectedTime.getMinutes().toString().padStart(2, "0");
      setTime(`${hh}:${mm}`);
    }
  };

  if (!selected) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Destinasi tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Image source={selected.image} style={styles.image} />

        <Text style={styles.name}>{selected.name}</Text>
        <Text style={styles.location}>{selected.location}</Text>

        <Text style={styles.price}>{formatRupiah(selected.price)}</Text>

        <Text style={styles.desc}>{selected.desc}</Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        {/* ROW 1 — Pickup & People */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Lokasi Penjemputan</Text>
            <View style={styles.selectBox}>
              <Picker
                selectedValue={pickup}
                onValueChange={(itemValue) => setPickup(String(itemValue))}
                style={{ height: 45 }}
              >
                <Picker.Item label="Pilih lokasi" value="" />
                <Picker.Item label="Terminal Rajabasa" value="Terminal Rajabasa" />
                <Picker.Item label="Terminal Kemiling" value="Terminal Kemiling" />
                <Picker.Item label="Stasiun Tanjung Karang" value="Stasiun Tanjung Karang" />
              </Picker>
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Jumlah Tiket</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={people}
              onChangeText={(v) => setPeople(v.replace(/[^0-9]/g, ""))}
              placeholder="1"
            />
          </View>
        </View>

        {/* ROW 2 — Date & Time */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Tanggal</Text>

            <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
              <Text style={{ color: date ? "#111" : "#9CA3AF" }}>{date || "Pilih Tanggal"}</Text>
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={onChangeDate}
              />
            )}
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Jam</Text>

            <TouchableOpacity style={styles.input} onPress={() => setShowTime(true)}>
              <Text style={{ color: time ? "#111" : "#9CA3AF" }}>{time || "Pilih Jam"}</Text>
            </TouchableOpacity>

            {showTime && (
              <DateTimePicker
                value={tempTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={onChangeTime}
              />
            )}
          </View>
        </View>

        {/* KONFIRMASI */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? "#1F67BB" : "#0080FF" },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Konfirmasi Pesanan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 350,
    height: 150,
    borderRadius: 20,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F67BB",
  },
  desc: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  form: {
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#111",
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    justifyContent: "center",
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
