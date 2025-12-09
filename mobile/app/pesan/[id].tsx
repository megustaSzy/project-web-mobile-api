import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PesanPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params?.id ?? null;
  const title = params?.title ?? "Nama Destinasi";
  const location = params?.location ?? "Lokasi";
  const price = params?.price ?? "100000";

  // === States ===
  const [penjemputan, setPenjemputan] = useState(""); // value dari Picker
  const [jumlahTiket, setJumlahTiket] = useState("1");

  // Dates/times as Date objects
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [waktuBerangkat, setWaktuBerangkat] = useState<Date>(new Date());
  const [waktuJemput, setWaktuJemput] = useState<Date>(new Date());

  // show flags for native pickers
  const [showDate, setShowDate] = useState(false);
  const [showTimeBerangkat, setShowTimeBerangkat] = useState(false);
  const [showTimeJemput, setShowTimeJemput] = useState(false);

  // Handlers for DateTimePicker onChange
  const onChangeDate = (event: any, selected?: Date) => {
    setShowDate(Platform.OS === "ios"); // on iOS keep it open
    if (selected) setTanggal(selected);
  };

  const onChangeTimeBerangkat = (event: any, selected?: Date) => {
    setShowTimeBerangkat(Platform.OS === "ios");
    if (selected) setWaktuBerangkat(selected);
  };

  const onChangeTimeJemput = (event: any, selected?: Date) => {
    setShowTimeJemput(Platform.OS === "ios");
    if (selected) setWaktuJemput(selected);
  };

  const handlePayNow = () => {
    // Validasi minimal
    if (!penjemputan) {
      alert("Pilih titik penjemputan.");
      return;
    }
    if (!jumlahTiket || Number(jumlahTiket) < 1) {
      alert("Masukkan jumlah tiket (minimal 1).");
      return;
    }

    // navigasi ke konfirmasi atau pembayaran. Pastikan route ada: /pesan/[id]
    // Kirim params sebagai query (jika perlu)
    const q = {
      id,
      title,
      location,
      price,
      penjemputan,
      tanggal: tanggal.toISOString(),
      waktuBerangkat: waktuBerangkat.toISOString(),
      waktuJemput: waktuJemput.toISOString(),
      jumlahTiket,
    };

    // contoh push ke route pesan/confirm (sesuaikan route Anda)
    router.push({
      pathname: `../pesan/${id ?? ""}`,
      params: q,
    });
  };

  // Safe formatted strings
  const fmtDate = (d: Date) =>
    d ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "";
  const fmtTime = (d: Date) =>
    d ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER BLUE */}
        <View style={styles.headerBlue}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Image
              source={require("../../assets/images/Watchly.png")}
              style={styles.headerMainImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* WHITE CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>{String(title)}</Text>

          <View style={styles.rowLocation}>
            <Ionicons name="location-outline" size={16} color="#7B7B8B" />
            <Text style={styles.location}>{String(location)}</Text>
          </View>

          {/* MAX USER */}
          <View style={styles.infoRow}>
            <View style={styles.infoBoxLeft}>
              <Text style={styles.infoText}>Max 16 User</Text>
            </View>
            <View style={styles.infoBoxRight}>
              <Text style={styles.infoText}>12 Hours Duration</Text>
            </View>
          </View>

          {/* FORM */}
          <Text style={styles.label}>Pilih lokasi penjemputan</Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={18} color="#777" />
            <Picker
              selectedValue={penjemputan}
              onValueChange={(value) => setPenjemputan(String(value))}
              style={styles.picker}
            >
              <Picker.Item label="-- Pilih titik penjemputan --" value="" />
              <Picker.Item label="Terminal Kemiling" value="terminal_kemiling" />
              <Picker.Item label="Terminal Rajabasa" value="terminal_rajabasa" />
              <Picker.Item label="Stasiun Tanjung Karang" value="stasiun_tanjung_karang" />
            </Picker>
          </View>

          <Text style={styles.label}>Pilih tanggal pemberangkatan</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setShowDate(true)}>
            <Ionicons name="calendar-outline" size={18} color="#777" />
            <Text style={styles.inputText}>{fmtDate(tanggal)}</Text>
          </TouchableOpacity>
          {showDate && (
            <DateTimePicker
              value={tanggal}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.label}>Pilih waktu pemberangkatan</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setShowTimeBerangkat(true)}>
            <Ionicons name="time-outline" size={18} color="#777" />
            <Text style={styles.inputText}>{fmtTime(waktuBerangkat)}</Text>
          </TouchableOpacity>
          {showTimeBerangkat && (
            <DateTimePicker
              value={waktuBerangkat}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "spinner"}
              onChange={onChangeTimeBerangkat}
            />
          )}

          <Text style={styles.label}>Pilih waktu penjemputan</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setShowTimeJemput(true)}>
            <Ionicons name="time-outline" size={18} color="#777" />
            <Text style={styles.inputText}>{fmtTime(waktuJemput)}</Text>
          </TouchableOpacity>
          {showTimeJemput && (
            <DateTimePicker
              value={waktuJemput}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "spinner"}
              onChange={onChangeTimeJemput}
            />
          )}

          <Text style={styles.label}>Jumlah tiket</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#777" />
            <TextInput
              placeholder="1"
              keyboardType="numeric"
              style={styles.input}
              value={jumlahTiket}
              onChangeText={(t) => setJumlahTiket(t.replace(/[^0-9]/g, ""))}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON FIXED */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.orderBtn} onPress={handlePayNow}>
          <Text style={styles.orderText}>Bayar Sekarang</Text>
          <Text style={styles.orderPrice}>
            IDR {Number(String(price)).toLocaleString("id-ID")} ,-
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===================== STYLE ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerBlue: {
    backgroundColor: "#2F80ED",
    height: 180,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCenter: {
    marginTop: 5,
    marginBottom: 40,
    alignItems: "center",
  },

  headerMainImage: {
    width: 320,
    height: 200,
    resizeMode: "contain",
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 40,
    elevation: 5,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 140,
  },

  title: { fontSize: 20, fontWeight: "bold" },

  rowLocation: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  location: { marginLeft: 5, color: "#6C6C6C" },

  infoRow: { flexDirection: "row", marginBottom: 25 },

  infoBoxLeft: {
    flex: 1,
    padding: 12,
    backgroundColor: "#2F80ED",
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    alignItems: "center",
  },

  infoBoxRight: {
    flex: 1,
    padding: 12,
    backgroundColor: "#2F80ED",
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },

  infoText: { color: "#fff", fontSize: 13 },

  label: { marginTop: 15, marginBottom: 5, color: "#555", fontSize: 14 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 12,
    borderRadius: 30,
    marginBottom: 10,
  },

  picker: {
    flex: 1,
    marginLeft: 8,
  },

  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },

  inputText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: "#222",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },

  orderBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 15,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  orderText: { color: "#fff", fontSize: 15, fontWeight: "bold" },

  orderPrice: { color: "#fff", fontWeight: "bold" },
});
