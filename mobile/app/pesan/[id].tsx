import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
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

const JAM_BERANGKAT = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00" , "14.00"];
const JAM_PULANG = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export default function PesanPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

  /* ================= PARAM ================= */
  const id = String(params.id ?? "");
  const title = String(params.title ?? "Nama Wisata");
  const category = String(params.category ?? "Kategori");
  const price = Number(params.price ?? 0);
  const imageUrl = String(params.imageUrl ?? "");

  /* ================= STATE ================= */
  const [pickupList, setPickupList] = useState<PickupItem[]>([]);
  const [pickupId, setPickupId] = useState<number | null>(null);

  const [tanggal, setTanggal] = useState(new Date());
  const [jamBerangkat, setJamBerangkat] = useState("07:00");
  const [jamPulang, setJamPulang] = useState("13:00");

  const [jumlahTiket, setJumlahTiket] = useState("1");
  const [showDate, setShowDate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ================= FETCH PICKUP ================= */
  useEffect(() => {
    async function fetchPickup() {
      try {
        const res = await fetch(`${BASE_URL}/api/pickup-locations`);
        const json = await res.json();
        setPickupList(Array.isArray(json.data) ? json.data : []);
      } catch {
        setPickupList([]);
      }
    }
    fetchPickup();
  }, []);

  /* ================= FORMAT ================= */
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const totalHarga = price * Number(jumlahTiket || 0);

  /* ================= HANDLER ================= */
  function openConfirm() {
    if (!pickupId) return Alert.alert("Validasi", "Pilih lokasi penjemputan");
    if (Number(jumlahTiket) < 1)
      return Alert.alert("Validasi", "Jumlah tiket minimal 1");
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

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
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

          {/* DATE */}
          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowDate(true)}
          >
            <Ionicons name="calendar-outline" size={18} />
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

          {/* JAM BERANGKAT */}
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

          {/* JAM PULANG */}
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
          <View style={styles.inputBox}>
            <Ionicons name="people-outline" size={18} />
            <TextInput
              value={jumlahTiket}
              keyboardType="numeric"
              onChangeText={(t) => setJumlahTiket(t.replace(/[^0-9]/g, ""))}
              style={styles.input}
            />
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
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: { height: 260 },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#001B38",
    opacity: 0.7,
  },

  card: {
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  title: { fontSize: 20, fontWeight: "bold", color: "#111" },

  categoryBadge: {
    backgroundColor: "#E8F1FF",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 10,
  },

  categoryText: { fontSize: 12, fontWeight: "600", color: "#2F80ED" },

  label: { marginTop: 16, marginBottom: 8, color: "#555" },

  inputBox: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 16,
    borderRadius: 25,
  },

  inputText: { marginLeft: 10 },
  input: { marginLeft: 10, flex: 1 },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  timeItem: {
    width: "22%",
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },

  timeActive: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },

  timeText: { color: "#333", fontWeight: "500" },
  timeTextActive: { color: "#fff", fontWeight: "bold" },

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
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 20,
    padding: 20,
  },
  title: { fontWeight: "bold", fontSize: 18, textAlign: "center" },
  total: { marginTop: 10, fontWeight: "bold", color: "#2F80ED" },
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
