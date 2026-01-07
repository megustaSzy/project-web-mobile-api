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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

/* ================= TYPES ================= */
type PickupItem = {
  id: number;
  name: string;
};

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
  const [loadingPickup, setLoadingPickup] = useState(false);

  const [tanggal, setTanggal] = useState(new Date());
  const [jamBerangkat, setJamBerangkat] = useState(new Date());
  const [jamPulang, setJamPulang] = useState(new Date());

  const [jumlahTiket, setJumlahTiket] = useState("1");

  const [showDate, setShowDate] = useState(false);
  const [showTimeStart, setShowTimeStart] = useState(false);
  const [showTimeEnd, setShowTimeEnd] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  /* ================= FETCH PICKUP ================= */
  useEffect(() => {
    async function fetchPickup() {
      try {
        setLoadingPickup(true);
        const res = await fetch(`${BASE_URL}/api/pickup-locations`);
        const json = await res.json();
        setPickupList(Array.isArray(json.data) ? json.data : []);
      } catch {
        setPickupList([]);
      } finally {
        setLoadingPickup(false);
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

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalHarga = price * Number(jumlahTiket || 0);

  /* ================= HANDLER ================= */
  function openConfirm() {
    if (!pickupId) {
      Alert.alert("Validasi", "Pilih lokasi penjemputan");
      return;
    }
    if (Number(jumlahTiket) < 1) {
      Alert.alert("Validasi", "Jumlah tiket minimal 1");
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
        jam_berangkat: jamBerangkat.toISOString(),
        jam_pulang: jamPulang.toISOString(),
        jumlah_tiket: jumlahTiket,
      },
    });
  }

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        {/* HEADER IMAGE */}
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
          {/* TITLE */}
          <Text style={styles.title}>{title}</Text>

          {/* CATEGORY BADGE */}
          {category && category !== "Kategori" && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {category.toLowerCase()}
              </Text>
            </View>
          )}

          {/* PICKUP */}
          <Text style={styles.label}>Lokasi Penjemputan</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={pickupId}
              onValueChange={(v) => setPickupId(v)}
              enabled={!loadingPickup}
            >
              <Picker.Item
                label={
                  loadingPickup
                    ? "Memuat lokasi..."
                    : "-- Pilih lokasi penjemputan --"
                }
                value={null}
              />
              {pickupList.map((p) => (
                <Picker.Item key={p.id} label={p.name} value={p.id} />
              ))}
            </Picker>
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

          {/* TIME START */}
          <Text style={styles.label}>Jam Berangkat</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowTimeStart(true)}
          >
            <Ionicons name="time-outline" size={18} />
            <Text style={styles.inputText}>{fmtTime(jamBerangkat)}</Text>
          </TouchableOpacity>

          {showTimeStart && (
            <DateTimePicker
              value={jamBerangkat}
              mode="time"
              onChange={(_, d) => {
                setShowTimeStart(false);
                if (!d) return;
                if (d.getHours() < 7 || d.getHours() > 13) {
                  Alert.alert("Jam tidak valid", "07.00 - 13.00");
                  return;
                }
                setJamBerangkat(d);
              }}
            />
          )}

          {/* TIME END */}
          <Text style={styles.label}>Jam Pulang</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowTimeEnd(true)}
          >
            <Ionicons name="time-outline" size={18} />
            <Text style={styles.inputText}>{fmtTime(jamPulang)}</Text>
          </TouchableOpacity>

          {showTimeEnd && (
            <DateTimePicker
              value={jamPulang}
              mode="time"
              onChange={(_, d) => {
                setShowTimeEnd(false);
                if (!d) return;
                if (d.getHours() < 13 || d.getHours() > 19) {
                  Alert.alert("Jam tidak valid", "13.00 - 19.00");
                  return;
                }
                setJamPulang(d);
              }}
            />
          )}

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
            <Text>
              📍 {pickupList.find((p) => p.id === pickupId)?.name}
            </Text>
            <Text>🗓 {fmtDate(tanggal)}</Text>
            <Text>
              ⏰ {fmtTime(jamBerangkat)} - {fmtTime(jamPulang)}
            </Text>
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

  title: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#111",
},

category: {
  marginTop: 4,
  marginBottom: 16,
  color: "#2F80ED",
  fontSize: 14,
  textTransform: "capitalize",
},

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F80ED",
    textTransform: "capitalize",
  },

categoryBadge: {
  alignSelf: "flex-start",
  backgroundColor: "#E8F1FF",
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 20,
  marginTop: 6,
  marginBottom: 10,
},


  header: { height: 260 },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#001B38",
    opacity: 0.72,
  },
  headerText: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerCategory: {
    color: "#E0E0E0",
    marginTop: 4,
    textTransform: "capitalize",
  },

  card: {
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  label: { marginTop: 14, marginBottom: 6, color: "#555" },

  inputBox: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  pickerBox: {
    height: 50,
    backgroundColor: "#F6F6F6",
    borderRadius: 25,
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  inputText: { marginLeft: 10 },
  input: { marginLeft: 10, flex: 1 },

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
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
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
