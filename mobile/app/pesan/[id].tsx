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
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PesanPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

  // ===============================
  // NORMALISASI PARAM
  // ===============================
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const title =
    typeof params.title === "string"
      ? params.title
      : Array.isArray(params.title)
      ? params.title[0]
      : "Nama Destinasi";

  const location =
    typeof params.location === "string"
      ? params.location
      : Array.isArray(params.location)
      ? params.location[0]
      : "Lokasi";

  const price =
    typeof params.price === "string"
      ? params.price
      : Array.isArray(params.price)
      ? params.price[0]
      : "0";

  const imageUrl =
    typeof params.imageUrl === "string"
      ? params.imageUrl
      : Array.isArray(params.imageUrl)
      ? params.imageUrl[0]
      : "";

  // ===============================
  // STATE
  // ===============================
  const [penjemputan, setPenjemputan] = useState("");
  const [jumlahTiket, setJumlahTiket] = useState("1");
  const [tanggal, setTanggal] = useState(new Date());
  const [waktuBerangkat, setWaktuBerangkat] = useState(new Date());
  const [waktuJemput, setWaktuJemput] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTimeBerangkat, setShowTimeBerangkat] = useState(false);
  const [showTimeJemput, setShowTimeJemput] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // ===============================
  // HANDLER
  // ===============================
  const handleOpenConfirm = () => {
    if (!penjemputan) {
      alert("Pilih titik penjemputan");
      return;
    }
    if (Number(jumlahTiket) < 1) {
      alert("Jumlah tiket minimal 1");
      return;
    }
    setShowConfirm(true);
  };

  const handlePayNow = () => {
    setShowConfirm(false);

    router.push({
      pathname: `../pesan/${id}`,
      params: {
        id,
        title,
        location,
        price,
        penjemputan,
        tanggal: tanggal.toISOString(),
        waktuBerangkat: waktuBerangkat.toISOString(),
        waktuJemput: waktuJemput.toISOString(),
        jumlahTiket,
      },
    });
  };

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalHarga = Number(price) * Number(jumlahTiket);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        {/* HEADER IMAGE */}
        <View style={styles.headerImageWrapper}>
          <Image
            source={{
              uri: imageUrl
                ? imageUrl.startsWith("http")
                  ? imageUrl
                  : `${BASE_URL}${imageUrl}`
                : "https://via.placeholder.com/600x400",
            }}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.rowLocation}>
            <Ionicons name="location-outline" size={16} color="#7B7B8B" />
            <Text style={styles.location}>{location}</Text>
          </View>

          <Text style={styles.label}>Pilih lokasi penjemputan</Text>
          <View style={styles.inputBox}>
            <Picker
              selectedValue={penjemputan}
              onValueChange={(v) => setPenjemputan(String(v))}
              style={styles.picker}
            >
              <Picker.Item label="-- Pilih lokasi --" value="" />
              <Picker.Item label="Terminal Kemiling" value="Kemiling" />
              <Picker.Item label="Terminal Rajabasa" value="Rajabasa" />
            </Picker>
          </View>

          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowDate(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#777" />
            <Text style={styles.inputText}>{fmtDate(tanggal)}</Text>
          </TouchableOpacity>

          {showDate && (
            <DateTimePicker
              value={tanggal}
              mode="date"
              onChange={(_, d) => {
                setShowDate(false);
                d && setTanggal(d);
              }}
            />
          )}

          <Text style={styles.label}>Jumlah tiket</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#777" />
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={jumlahTiket}
              onChangeText={(t) => setJumlahTiket(t.replace(/[^0-9]/g, ""))}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.orderBtn} onPress={handleOpenConfirm}>
          <Text style={styles.orderText}>Buat Pesanan</Text>
          <Text style={styles.orderPrice}>
            IDR {totalHarga.toLocaleString("id-ID")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= POPUP ================= */}
      <Modal transparent visible={showConfirm} animationType="fade">
        <View style={popup.overlay}>
          <View style={popup.box}>
            <Text style={popup.title}>Konfirmasi Pesanan</Text>

            <Text>📍 {location}</Text>
            <Text>🗓 {fmtDate(tanggal)}</Text>
            <Text>👥 {jumlahTiket} Orang</Text>

            <Text style={popup.total}>
              Total IDR {totalHarga.toLocaleString("id-ID")}
            </Text>

            <View style={popup.row}>
              <TouchableOpacity
                style={popup.cancel}
                onPress={() => setShowConfirm(false)}
              >
                <Text>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={popup.pay} onPress={handlePayNow}>
                <Text style={{ color: "#fff" }}>Bayar Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLE ASLI (TIDAK DIUBAH) ================= */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  headerImageWrapper: { 
    width: "100%", 
    height: 200, 
    position: "relative" 
  },
  headerImage: { 
    width: "100%", 
    height: 300 
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: 400,
    backgroundColor: "#001B38",
    opacity: 0.72,
  },
  card: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  rowLocation: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10 
  },
  location: { 
    marginLeft: 5, 
    color: "#6C6C6C" 
  },
  label: { 
    marginTop: 15, 
    marginBottom: 5, 
    color: "#555" 
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 12,
    borderRadius: 30,
  },
  picker: { 
    flex: 1 
  },
  input: { 
    marginLeft: 10, 
    flex: 1 
  },
  inputText: { 
    marginLeft: 10 
  },
  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    paddingHorizontal: 20,
  },
  orderBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 15,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  orderText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  orderPrice: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

/* ================= STYLE POPUP (BARU) ================= */
const popup = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  total: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#2F80ED",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancel: {
    width: "45%",
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  pay: {
    width: "45%",
    backgroundColor: "#2F80ED",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
});
