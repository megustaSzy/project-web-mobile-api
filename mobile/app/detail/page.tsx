import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const destinations = [
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    category: "Pantai",
    price: 100000,
    include: ["Travel Antar Jemput", "Tiket Masuk", "Sesai Jadwal"],
    description:
      "Temukan berbagai wisata menarik di Kabupaten TanggamusTemukan Berbagai Wisata Di Kabupaten TanggamusTemukan Berbagai Wisata Di Kabupaten TanggamusTemukan Berbagai Wisata Di Kabupaten TanggamusTemukan Berbagai Wisata Di Kabupaten Tanggamus",
    warning: [
      "Datang 30 menit sebelum pemberangkatan.",
      "Harga dapat berubah sewaktu-waktu",
      "Pemesanan dianggap valid setelah tiket diterbitkan.",
    ],
    image: require("../../assets/images/hero3.jpg"),
  },
];

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function DetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [pressed, setPressed] = useState(false);

  const detail = destinations.find((d) => d.id == Number(id));

  if (!detail) return <Text>Data tidak ditemukan.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {/* HERO IMAGE */}
        <View style={styles.heroContainer}>
          <Image source={detail.image} style={styles.heroImage} />
          <View style={styles.overlay} />
        </View>

        {/* FLOATING CARD */}
        <View style={styles.card}>
          {/* TITLE */}
          <Text style={styles.title}>{detail.name}</Text>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.subText}>{detail.location}</Text>
          </View>

          {/* BADGE */}
          <View style={styles.badgeWrapper}>
            <View style={styles.badge}>
              <Ionicons name="people-outline" size={18} color="#fff" />
              <Text style={styles.badgeText}>Max 16 User</Text>
            </View>

            <View style={styles.badge}>
              <Ionicons name="time-outline" size={18} color="#fff" />
              <Text style={styles.badgeText}>12 Hours Duration</Text>
            </View>
          </View>

          {/* INCLUDE */}
          <Text style={styles.sectionTitle}>Include</Text>

          <View style={styles.includeWrapper}>
            {detail.include.map((item, index) => (
              <View key={index} style={styles.includePill}>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{detail.description}</Text>

          {/* PERHATIAN */}
          <Text style={styles.sectionTitle}>Perhatian</Text>
          {detail.warning.map((item, index) => (
            <Text key={index} style={styles.warning}>
              • {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM BUTTON */}
      <View style={styles.bottomBar}>
        <Text style={styles.priceLabel}>{formatRupiah(detail.price)}</Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: pressed ? "#E0E0E0" : "#0080FF" },
          ]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() =>
            router.push({
              pathname: "/pesan/page",
              params: { id: detail.id },
            })
          }
        >
          <Text style={styles.buttonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  heroContainer: {
    width: "100%",
    height: 330,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,27,56,0.72)",
  },

  /* FLOATING CARD */
  card: {
    marginTop: -40,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 22,
    elevation: 7,
  },

  title: { fontSize: 21, fontWeight: "800", color: "#111" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  subText: { marginLeft: 4, color: "#6B7280" },

  badgeWrapper: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },

  badge: {
    backgroundColor: "#001B38",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  badgeText: { color: "#fff", fontSize: 13 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    color: "#111",
  },

  includeWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  includePill: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  includeText: { fontSize: 13, color: "#374151" },

  description: {
    marginTop: 6,
    color: "#4B5563",
    lineHeight: 20,
  },

  warning: {
    marginTop: 4,
    color: "#FF3B30",
    fontSize: 14,
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0080FF",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 14,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
