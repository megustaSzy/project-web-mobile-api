import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DestinationDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const id = params.id ? String(params.id) : null;
  const title = params.title ? String(params.title) : "No Title";
  const location = params.location ? String(params.location) : "Unknown";
  const price = params.price ? String(params.price) : "0";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        {/* HEADER IMAGE */}
        <View style={styles.imageWrapper}>
          <Image source={require("../../assets/images/hero3.jpg")} style={styles.headerImage} />
          <View style={styles.overlay} />
        </View>

        {/* Content */}
        <View style={styles.card}>
          {/* Title & Location */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.location}>{location}</Text>

          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBoxLeft}>
              <Text style={styles.infoText}>Max 16 User</Text>
            </View>
            <View style={styles.infoBoxRight}>
              <Text style={styles.infoText}>12 Hours Duration</Text>
            </View>
          </View>

          {/* Include */}
          <Text style={styles.subTitle}>Include</Text>
          <View style={styles.includeRow}>
            <View style={styles.includeItem}><Text style={styles.includeText}>Travel Pulang Pergi</Text></View>
            <View style={styles.includeItem}><Text style={styles.includeText}>Tiket Masuk</Text></View>
            <View style={styles.includeItem}><Text style={styles.includeText}>Snack LamiGo</Text></View>
          </View>


          {/* Description */}
          <Text style={styles.subTitle}>Deskripsi</Text>
          <Text style={styles.description}>
            Temukan berbagai wisata di Kabupaten Tanggamus. Jelajahi destinasi
            terbaik dan dapatkan pengalaman luar biasa.
          </Text>
          {/* Perhatian */}
          <Text style={styles.subTitle}>Perhatian</Text>
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>- Datang 30 menit sebelum pemberangkatan.</Text>
            <Text style={styles.noticeText}>- LamiGo hanya penyedia travel dan tiket destinasi.</Text>
            <Text style={styles.noticeText}>- Kejadian apapun saat ditempat wisata bukan tanggung jawab LamiGo.</Text>
          </View>
        </View>
      </ScrollView>

      {/* FIXED BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => {
            if (!id) {
              console.warn("ID tidak ditemukan");
              return;
            }
            router.push({
              pathname: "../pesan/[id]",
              params: { id: String(id), title, location, price },
            });
          }}
        >
          <Text style={styles.orderText}>Pesan Sekarang</Text>
          <Text style={styles.orderPrice}>IDR {price},-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===================== STYLE ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  imageWrapper: { width: "100%", height: 270, position: "relative" },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#001B38",
    opacity: 0.72,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },

  title: { fontSize: 22, fontWeight: "bold", color: "#111" },
  location: { fontSize: 14, color: "#6C6C6C", marginBottom: 15 },

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

  subTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },

  includeRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 25, gap: 15 },
  includeItem: { backgroundColor: "#F8F8F8", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, elevation: 1, justifyContent: "center", alignItems: "center" },
  includeText: { fontSize: 12, color: "#333", fontWeight: "600" },

  noticeBox: { backgroundColor: "#FFF4E5", padding: 15, borderRadius: 12, marginBottom: 20 },
  noticeText: { fontSize: 13, color: "#FF8000", marginBottom: 6 },

  description: { color: "#6C6C6C", lineHeight: 20, marginBottom: 20 },

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
    alignItems: "center",
  },
  orderText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  orderPrice: { color: "#fff", fontWeight: "bold" },
});
