import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

/* ================= TYPES ================= */
type PickupItem = {
  id: number;
  name: string;
};

const JAM_BERANGKAT = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00"];
const JAM_PULANG = ["13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

export default function PesanPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

  const id = String(params.id ?? "");
  const title = String(params.title ?? "Nama Wisata");
  const category = String(params.category ?? "Kategori");
  const price = Number(params.price ?? 0);
  const imageUrl = String(params.imageUrl ?? "");

  const [pickupList, setPickupList] = useState<PickupItem[]>([]);
  const [pickupId, setPickupId] = useState<number | null>(null);

  const [tanggal, setTanggal] = useState(new Date());
  const [jamBerangkat, setJamBerangkat] = useState("07:00");
  const [jamPulang, setJamPulang] = useState("13:00");

  const [jumlahTiket, setJumlahTiket] = useState(1);
  const [showDate, setShowDate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/pickup-locations`)
      .then((res) => res.json())
      .then((json) =>
        setPickupList(Array.isArray(json.data) ? json.data : [])
      )
      .catch(() => setPickupList([]));
  }, []);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const totalHarga = price * jumlahTiket;

  function openConfirm() {
  if (!pickupId) {
    setErrorMsg("Lokasi penjemputan belum dipilih");
    setShowError(true);
    return;
  }

  if (!jamBerangkat || !jamPulang) {
    setErrorMsg("Jam berangkat dan pulang harus dipilih");
    setShowError(true);
    return;
  }

  setShowConfirm(true);
}


  function handlePay() {
    setShowConfirm(false);
    router.push({
      pathname: `../pesan/${id}`,
      params: {
        wisata_id: id,
        pickup_id: pickupId,
        tanggal: tanggal.toISOString(),
        jam_berangkat: jamBerangkat,
        jam_pulang: jamPulang,
        jumlah_tiket: jumlahTiket,
      },
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        {/* HEADER */}
        <View style={styles.header}>
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
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          {/* PICKUP */}
          <Text style={styles.label}>Lokasi Penjemputan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {pickupList.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.pickupItem,
                  pickupId === p.id && styles.pickupActive,
                ]}
                onPress={() => setPickupId(p.id)}
              >
                <Ionicons name="location-outline" size={16} />
                <Text
                  style={[
                    styles.pickupText,
                    pickupId === p.id && { color: "#fff" },
                  ]}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* TANGGAL */}
          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowDate(true)}
          >
            <Ionicons name="calendar-outline" size={18} />
            <Text style={styles.selectText}>{fmtDate(tanggal)}</Text>
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

          {/* JAM */}
          <Text style={styles.label}>Jam Berangkat</Text>
          <View style={styles.timeGrid}>
            {JAM_BERANGKAT.map((j) => (
              <TouchableOpacity
                key={j}
                style={[
                  styles.timeItem,
                  jamBerangkat === j && styles.timeActive,
                ]}
                onPress={() => setJamBerangkat(j)}
              >
                <Text
                  style={[
                    styles.timeText,
                    jamBerangkat === j && styles.timeTextActive,
                  ]}
                >
                  {j}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Jam Pulang</Text>
          <View style={styles.timeGrid}>
            {JAM_PULANG.map((j) => (
              <TouchableOpacity
                key={j}
                style={[
                  styles.timeItem,
                  jamPulang === j && styles.timeActive,
                ]}
                onPress={() => setJamPulang(j)}
              >
                <Text
                  style={[
                    styles.timeText,
                    jamPulang === j && styles.timeTextActive,
                  ]}
                >
                  {j}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* JUMLAH */}
          <Text style={styles.label}>Jumlah Tiket</Text>
          <View style={styles.counter}>
            <TouchableOpacity
              onPress={() => setJumlahTiket(Math.max(1, jumlahTiket - 1))}
            >
              <Ionicons name="remove-circle-outline" size={32} />
            </TouchableOpacity>
            <Text style={styles.counterText}>{jumlahTiket}</Text>
            <TouchableOpacity onPress={() => setJumlahTiket(jumlahTiket + 1)}>
              <Ionicons name="add-circle-outline" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={openConfirm}>
          <Text style={styles.btnText}>Buat Pesanan</Text>
          <Text style={styles.btnText}>
            IDR {totalHarga.toLocaleString("id-ID")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONFIRM */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={popup.overlay}>
          <View style={popup.box}>
            <Text style={popup.title}>Konfirmasi Pesanan</Text>
            <Text>🏞 {title}</Text>
            <Text>🗓 {fmtDate(tanggal)}</Text>
            <Text>⏰ {jamBerangkat} - {jamPulang}</Text>
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
              <TouchableOpacity style={popup.pay} onPress={handlePay}>
                <Text style={{ color: "#fff" }}>Bayar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showError} transparent animationType="fade">
  <View style={popup.overlay}>
    <View style={popup.errorBox}>
      <Ionicons name="alert-circle-outline" size={50} color="#E74C3C" />
      <Text style={popup.errorTitle}>Data Belum Lengkap</Text>
      <Text style={popup.errorText}>{errorMsg}</Text>

      <TouchableOpacity
        style={popup.errorBtn}
        onPress={() => setShowError(false)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { height: 260 },
  headerImage: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#001B38", opacity: 0.7 },

  card: {
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  title: { fontSize: 20, fontWeight: "bold" },
  categoryBadge: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: "flex-start",
  },
  categoryText: { color: "#2F80ED", fontWeight: "600" },

  label: { marginTop: 18, marginBottom: 8, color: "#555" },

  selectBox: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 25,
    paddingHorizontal: 16,
  },
  selectText: { marginLeft: 10 },

  pickupItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  pickupActive: { backgroundColor: "#2F80ED" },
  pickupText: { marginLeft: 6 },

  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  timeItem: {
    width: "22%",
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  timeActive: { backgroundColor: "#2F80ED", borderColor: "#2F80ED" },
  timeText: { color: "#333" },
  timeTextActive: { color: "#fff", fontWeight: "bold" },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 140,
    marginTop: 6,
  },
  counterText: { fontSize: 18, fontWeight: "bold" },

  bottom: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: "#2F80ED",
    padding: 16,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});

/* ================= POPUP ================= */
const popup = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", 
    alignItems: "center" 
  },

  box: { 
    backgroundColor: "#fff", 
    width: "85%", 
    borderRadius: 20, 
    padding: 20 
  },

  title: { 
    fontWeight: "bold", 
    fontSize: 18, 
    textAlign: "center" 
  },

  total: { 
    marginTop: 10, 
    fontWeight: "bold", 
    color: "#2F80ED" 
  },

  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 20 
  },
  cancel: { 
    width: "45%", 
    backgroundColor: "#ddd", 
    padding: 12, 
    borderRadius: 30, 
    alignItems: "center" 
  },
  pay: { 
    width: "45%", 
    backgroundColor: "#2F80ED", 
    padding: 12, 
    borderRadius: 30, 
    alignItems: "center" 
  },

  errorBox: {
  backgroundColor: "#fff",
  width: "80%",
  borderRadius: 20,
  padding: 24,
  alignItems: "center",
},
errorTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 10,
},
errorText: {
  textAlign: "center",
  color: "#555",
  marginVertical: 10,
},
errorBtn: {
  marginTop: 10,
  backgroundColor: "#E74C3C",
  paddingHorizontal: 30,
  paddingVertical: 10,
  borderRadius: 20,
},

});
