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
  const [jamBerangkat, setJamBerangkat] = useState("07:00");
  const [jamPulang, setJamPulang] = useState("13:00");

  const [jumlahTiket, setJumlahTiket] = useState("1");
  const [showDate, setShowDate] = useState(false);
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

          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}

          {/* PICKUP */}
          <Text style={styles.label}>Lokasi Penjemputan</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={pickupId}
              onValueChange={(v) => setPickupId(v)}
            >
              <Picker.Item label="Pilih lokasi penjemputan" value={null} />
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

          {/* JAM BERANGKAT */}
          <Text style={styles.label}>Jam Berangkat</Text>
          <View style={styles.pickerBox}>
            <Ionicons
              name="time-outline"
              size={18}
              style={styles.pickerIcon}
            />
            <Picker
              selectedValue={jamBerangkat}
              onValueChange={setJamBerangkat}
            >
              {["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"].map(
                (j) => (
                  <Picker.Item key={j} label={j} value={j} />
                )
              )}
            </Picker>
          </View>

          {/* JAM PULANG */}
          <Text style={styles.label}>Jam Pulang</Text>
          <View style={styles.pickerBox}>
            <Ionicons
              name="time-outline"
              size={18}
              style={styles.pickerIcon}
            />
            <Picker selectedValue={jamPulang} onValueChange={setJamPulang}>
              {["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map(
                (j) => (
                  <Picker.Item key={j} label={j} value={j} />
                )
              )}
            </Picker>
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
            <Text>
              📍 {pickupList.find((p) => p.id === pickupId)?.name}
            </Text>
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

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },

  categoryBadge: {
    backgroundColor: "#E8F1FF",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
    marginBottom: 14,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F80ED",
  },

  label: {
    marginTop: 14,
    marginBottom: 6,
    color: "#555",
    fontSize: 13,
  },

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
    paddingHorizontal: 10,
    marginBottom: 4,
  },

  pickerIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
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
