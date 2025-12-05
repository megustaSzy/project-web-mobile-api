import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

// Data destinasi
const destinations = [
  {
    id: 1,
    name: "Rio The Beach",
    location: "Kalianda",
    category: "Pantai",
    price: 100000,
    description:
      "Temukan berbagai wisata menarik di Kabupaten Tanggamus, dengan panorama indah dan pengalaman liburan berkesan.",
    image: require("../../assets/images/hero1.jpg"),
  },
  {
    id: 2,
    name: "Senaya Beach",
    location: "Kalianda",
    category: "Pantai",
    price: 120000,
    description:
      "Destinasi pantai yang tenang dengan ombak lembut, cocok untuk liburan bersama keluarga.",
    image: require("../../assets/images/hero2.jpg"),
  },
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    category: "Pantai",
    price: 80000,
    description:
      "Nikmati keindahan laut biru dengan fasilitas lengkap, suasana nyaman, dan lokasi strategis.",
    image: require("../../assets/images/hero3.jpg"),
  },
];

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "decimal",
  }).format(value);

export default function DetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [pressed, setPressed] = useState(false);

  const detail = destinations.find((d) => d.id == Number(id));

  if (!detail) {
    return (
      <View style={styles.center}>
        <Text>Data tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <Image source={detail.image} style={styles.headerImage} />

      <View style={styles.content}>

        {/* TITLE + PRICE */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{detail.name}</Text>

            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.subInfo}>{detail.location}</Text>

              <Text style={styles.dot}>  </Text>

              <Ionicons name="pricetag-outline" size={16} color="#6B7280" />
              <Text style={styles.subInfo}>{detail.category}</Text>
            </View>
          </View>

          <Text style={styles.price}>IDR {formatRupiah(detail.price)}</Text>
        </View>

        {/* INFO BADGE */}
        <View style={styles.infoWrapper}>
          <View style={styles.infoCard}>
            <Ionicons name="people-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>Max 16 Orang</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>12 Jam Durasi</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{detail.description}</Text>

        {/* BUTTON PESAN */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: pressed ? "#F0F0F0" : "#0080FF" },
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerImage: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  subInfo: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },

  dot: {
    color: "#6B7280",
    marginHorizontal: 6,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F67BB",
    marginTop: 4,
  },

  infoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
    ,
  },

  infoCard: {
    backgroundColor: "#D7D7D7",
    flex: 1,
    paddingVertical: 7,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    gap: 8,
  },

  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    color: "#111",
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },

  button: {
    marginTop: 28,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    
    
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
});
