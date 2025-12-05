import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Feather, Umbrella, Mountain, Layers, MapPin, Droplet } from "lucide-react-native";

// ===========================================================================
// ✔ FORMAT RUPIAH FIX
// ===========================================================================
const formatRupiah = (value: string | number | bigint): string => {
  const number = Number(String(value).replace(/[^\d]/g, ""));
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};


// ===========================================================================
// ✔ DESTINASI + HARGA DITAMBAHKAN (WAJIB AGAR TIDAK ERROR)
// ===========================================================================
const destinations = [
  { id: 1, name: "Rio The Beach", location: "Kalianda", price: 20000, image: require("../../assets/images/hero1.jpg") },
  { id: 2, name: "Senaya Beach", location: "Kalianda", price: 18000, image: require("../../assets/images/hero2.jpg") },
  { id: 3, name: "Green Elty Krakatoa", location: "Kalianda", price: 25000, image: require("../../assets/images/hero3.jpg") },
];

export default function HomeScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const categories = [
    { name: "Pantai", icon: Umbrella },
    { name: "Gunung", icon: Mountain },
    { name: "Bukit", icon: Layers },
    { name: "Pulau", icon: MapPin },
    { name: "Air Terjun", icon: Droplet },
  ];

  const handleSearch = (textInput: string) => {
    const query = (textInput ? textInput : searchText).trim();
    if (!query) return;

    setHistory((prevHistory) => {
      const arr = Array.isArray(prevHistory) ? prevHistory : [];
      return arr.includes(query) ? arr : [query, ...arr];
    });

    const results = destinations.filter((dest) =>
      dest.name.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length > 0) {
      router.push({
        pathname: "/pesan/page",
        params: { id: results[0].id },
      });
    } else {
      Alert.alert("Destinasi tidak ditemukan", "Coba kata kunci lain.");
    }

    setShowHistory(false);
  };

  return (
    <ScrollView style={styles.container}>

      {/* BLUE HEADER */}
      <View style={styles.headerBg} />

      {/* MAIN CARD */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>Lokasi Kamu</Text>
        <Text style={styles.location}>Kota Bandar Lampung , Lampung</Text>

        {/* Penjemputan + Tujuan */}
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Penjemputan</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#555" />
              <TextInput placeholder="Kalianda" style={styles.input} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tujuan</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#555" />
              <TextInput placeholder="Kalianda" style={styles.input} />
            </View>
          </View>
        </View>

        {/* Tanggal + Jam */}
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tanggal</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#555" />
              <TextInput placeholder="Pilih tanggal" style={styles.input} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jam</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="time-outline" size={20} color="#555" />
              <TextInput placeholder="Pilih jam" style={styles.input} />
            </View>
          </View>
        </View>

        {/* Search + History */}
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.historyBtn}>Histori</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CATEGORY CHIPS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <View key={index} style={styles.categoryChip}>
              <Icon size={18} color="#007BFF" />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* FAVORIT */}
      <Text style={styles.sectionTitle}>Tujuan Wisata Favorit</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {destinations.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={styles.favCard}
            onPress={() =>
              router.push({
                pathname: "/detail/page",
                params: { id: dest.id },
              })
            }
          >
            <Image source={dest.image} style={styles.favImage} />

            <View style={styles.favTextBox}>
              <Text style={styles.favTitle}>{dest.name}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Ionicons name="location-outline" size={12} color="#777" />
                <Text numberOfLines={1} style={[styles.favDesc, { marginLeft: 2 }]}>
                  {dest.location}
                </Text>
              </View>

              {/* ✔ FORMAT RUPIAH */}
              <Text style={styles.favPrice}>
                Rp {formatRupiah(dest.price)} / orang
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* DESTINASI KABUPATEN */}
      <Text style={styles.sectionTitle}>Daftar Destinasi Kabupaten</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        <View style={styles.destCard}>
          <Image source={require("../../assets/images/favorite/21.png")} style={styles.destImage} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.destTitle}>Kabupaten Tanggamus</Text>
            <Text style={styles.destCount}>12 Destinasi</Text>
            <Text style={styles.destDesc}>Temukan Berbagai Wisata di Kabupaten Tanggamus</Text>

            <TouchableOpacity style={{ marginTop: 6 }} onPress={() => router.push("../pesanantour/page")}>
              <Text style={styles.link}>Lihat Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.destCard}>
          <Image source={require("../../assets/images/favorite/24.png")} style={styles.destImage} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.destTitle}>Kabupaten Tanggamus</Text>
            <Text style={styles.destCount}>10 Destinasi</Text>
            <Text style={styles.destDesc}>Temukan Berbagai Wisata di Kabupaten Tanggamus</Text>

            <TouchableOpacity style={{ marginTop: 6 }} onPress={() => router.push("../pesanantour/page")}>
              <Text style={styles.link}>Lihat Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BERITA */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Berita</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginBottom: 30 }}>
        <View style={styles.newsCard}>
          <Image source={require("../../assets/images/hero1.jpg")} style={styles.newsImage} />
          <View style={styles.newsTextBox}>
            <Text style={styles.newsTitle}>New Destinasi</Text>
            <View style={styles.rowCenter}>
              <Ionicons name="location-outline" size={14} />
              <Text style={styles.newsLocation}>Aceh</Text>
            </View>
          </View>
        </View>

        <View style={styles.newsCard}>
          <Image source={require("../../assets/images/hero1.jpg")} style={styles.newsImage} />
          <View style={styles.newsTextBox}>
            <Text style={styles.newsTitle}>Destinasi Terbengkalai</Text>
            <View style={styles.rowCenter}>
              <Ionicons name="location-outline" size={14} />
              <Text style={styles.newsLocation}>Sibolga</Text>
            </View>
          </View>
        </View>

        <View style={styles.newsCard}>
          <Image source={require("../../assets/images/hero1.jpg")} style={styles.newsImage} />
          <View style={styles.newsTextBox}>
            <Text style={styles.newsTitle}>Goa Baru Viral</Text>
            <View style={styles.rowCenter}>
              <Ionicons name="location-outline" size={14} />
              <Text style={styles.newsLocation}>Lampung</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },

  headerBg: { height: 180, backgroundColor: "#007BFF" },

  cardBox: {
    backgroundColor: "#fff",
    marginTop: -70,
    alignSelf: "center",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  label: { color: "#777", fontSize: 13 },

  location: { fontSize: 16, fontWeight: "600", marginTop: 2 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  searchBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 30,
  },

  searchText: { color: "#fff", fontWeight: "600" },

  historyBtn: { fontSize: 14, fontWeight: "600" },

  inputGroup: { width: "48%" },

  inputLabel: { fontSize: 12, color: "#666", marginBottom: 6 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 1,
  },

  input: { flex: 1, fontSize: 14, marginLeft: 8 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },

  sectionTitle: { marginLeft: 20, marginTop: 20, fontSize: 18, fontWeight: "700" },

  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E8F2FF",
    borderRadius: 20,
    marginLeft: 10,
  },

  categoryText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  favCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    width: 300,
    marginLeft: 20,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  favImage: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },

  favTextBox: {
    flex: 1,
    marginLeft: 12,
  },

  favTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  favDesc: {
    fontSize: 12,
    color: "#555",
  },

  favPrice: {
    fontSize: 12,
    color: "#007BFF",
    fontWeight: "600",
    marginTop: 4,
  },

  destCard: {
    marginTop: 15,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    flexDirection: "row",
    elevation: 3,
  },

  destImage: { width: 60, height: 60, borderRadius: 10 },

  destTitle: { fontSize: 16, fontWeight: "700" },

  destCount: { fontSize: 12, color: "#007BFF", marginTop: 2, fontWeight: "600" },

  destDesc: { fontSize: 12, color: "#555", marginTop: 4 },

  link: { color: "#007BFF", fontWeight: "700" },

  newsCard: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginLeft: 20,
    padding: 10,
    elevation: 3,
    flexDirection: "column",
  },

  newsImage: { width: "100%", height: 120, borderRadius: 12 },

  newsTextBox: { marginTop: 10 },

  newsTitle: { fontSize: 16, fontWeight: "700" },

  newsLocation: { fontSize: 12, marginLeft: 4 },

  rowCenter: { flexDirection: "row", alignItems: "center", marginLeft: 8, marginTop: 4 },
});
