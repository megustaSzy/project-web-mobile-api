import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DestinationDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = params.title ? String(params.title) : "No Title";
  const location = params.location ? String(params.location) : "Unknown";
  const price = params.price ? String(params.price) : "0";
  const image = params.image ? decodeURIComponent(String(params.image)) : "https://picsum.photos/1000/800";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.headerImage} />

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          {/* Location */}
          <View style={styles.rowLocation}>
            <Ionicons name="location-outline" size={16} color="#7B7B8B" />
            <Text style={styles.location}>{location}</Text>
          </View>

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
            <Text style={styles.includeItem}>Travel Pulang Pergi</Text>
            <Text style={styles.includeItem}>Tiket Masuk</Text>
            <Text style={styles.includeItem}>Snack LamiGo</Text>
          </View>

          {/* Description */}
          <Text style={styles.subTitle}>Deskripsi</Text>
          <Text style={styles.description}>
            Temukan Berbagai Wisata Di Kabupaten Tanggamus. Jelajahi destinasi terbaik dan dapatkan pengalaman luar biasa.
          </Text>
        </View>

      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.orderBtn}>
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
  imageWrapper: { width: "100%", height: 270 },
  headerImage: { width: "100%", height: "100%" },
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
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  rowLocation: { flexDirection: "row", alignItems: "center", marginBottom: 15, marginTop: 5 },
  location: { marginLeft: 5, color: "#6C6C6C" },
  infoRow: { flexDirection: "row", marginBottom: 25 },
  infoBoxLeft: {
    flex: 1, padding: 12, backgroundColor: "#2F80ED",
    borderTopLeftRadius: 40, borderBottomLeftRadius: 40, alignItems: "center",
  },
  infoBoxRight: {
    flex: 1, padding: 12, backgroundColor: "#2F80ED",
    borderTopRightRadius: 40, borderBottomRightRadius: 40, alignItems: "center",
  },
  infoText: { color: "#fff", fontSize: 13 },
  subTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  includeRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 25 },
  includeItem: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  description: { color: "#6C6C6C", lineHeight: 20, marginBottom: 140 },
  bottomContainer: {
    position: "absolute", bottom: 0, width: "100%",
    padding: 20, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E5E5E5",
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
