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

// Contoh daftar destinasi
const destinations = [
  { id: 1, name: "Rio The Beach", location: "Kalianda", image: require("../../assets/images/hero1.jpg") },
  { id: 2, name: "Senaya Beach", location: "Kalianda", image: require("../../assets/images/hero2.jpg") },
  { id: 3, name: "Green Elty Krakatoa", location: "Kalianda", image: require("../../assets/images/hero3.jpg") },
];

export default function HomeScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false); // untuk toggle tampil history

  const handleSearch = (textInput: string) => {
    const query = (textInput ? textInput : searchText).trim();
    if (!query) return;

    // update history
    setHistory(prevHistory => {
      const arr = Array.isArray(prevHistory) ? prevHistory : [];
      return arr.includes(query) ? arr : [query, ...arr];
    });

    // cari destinasi
    const results = destinations.filter(dest =>
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

    setShowHistory(false); // sembunyikan history setelah search
  };


  return (
    <ScrollView style={styles.container}>
      {/* Blue Header */}
      <View style={styles.headerBg} />

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Lokasi Kamu</Text>
        <Text style={styles.location}>Kota Bandar Lampung, Lampung</Text>

        <Text style={[styles.label, { marginTop: 15 }]}>Tujuan</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Kalianda"
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(searchText)}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
            <Text style={styles.historyBtn}>Cari Histori ➜</Text>
          </TouchableOpacity>
        </View>

        {/* Tampilkan history hanya jika showHistory true */}
        {showHistory && history.length > 0 && (
          <View style={{ marginTop: 10, padding: 10, backgroundColor: "#f1f1f1", borderRadius: 10 }}>
            {history.map((h, i) => (
              <TouchableOpacity key={i} onPress={() => handleSearch(h)}>
                <Text style={{ color: "#555", fontSize: 14, paddingVertical: 4 }}>• {h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Tujuan Wisata Favorit */}
      <Text style={styles.sectionTitle}>Tujuan Wisata Favorit</Text>

      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginTop: 15, marginBottom: 10 }}
>
  {destinations.map((dest) => (
    <TouchableOpacity
      key={dest.id}
      style={styles.favCard}
      onPress={() =>
        router.push({
          pathname: "/pesan/page",
          params: { id: dest.id },
        })
      }
    >
      <Image source={dest.image} style={styles.favImage} />

      <View style={styles.favTextBox}>
        <Text style={styles.favTitle}>{dest.name}</Text>
        <Text style={styles.favDesc} numberOfLines={1}>
          Pantai indah dengan pasir putih, cocok untuk liburan keluarga.
        </Text>
        <Text style={styles.favPrice}>Rp 50.000 / orang</Text>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>


      {/* Daftar Destinasi */}
      <Text style={styles.sectionTitle}>Daftar Destinasi Kabupaten</Text>
      <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false} 
  style={{ marginTop: 10 }}
>
  {/* CARD 1 */}
  <View style={styles.destCard}>
    <Image
      source={require("../../assets/images/favorite/21.png")}
      style={styles.destImage}
    />

    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.destTitle}>Kabupaten Tanggamus</Text>
      <Text style={styles.destCount}>12 Destinasi</Text>
      <Text style={styles.destDesc}>
        Temukan Berbagai Wisata di Kabupaten Tanggamus
      </Text>

      <TouchableOpacity style={{ marginTop: 6 }}
  onPress={() => router.push("../pesanantour/page")}>
        <Text style={styles.link}>Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* CARD 2 */}
  <View style={styles.destCard}>
    <Image
      source={require("../../assets/images/favorite/24.png")}
      style={styles.destImage}
    />

    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.destTitle}>Kabupaten Tanggamus</Text>
      <Text style={styles.destCount}>10 Destinasi</Text>
      <Text style={styles.destDesc}>
        Temukan Berbagai Wisata di Kabupaten Tanggamus
      </Text>

      <TouchableOpacity
  style={{ marginTop: 6 }}
  onPress={() => router.push("../pesanantour/page")}
>
  <Text style={styles.link}>Lihat Detail</Text>
</TouchableOpacity>
    </View>
  </View>
</ScrollView>

      {/* ====================== */}
      {/* Section Berita */}
      {/* ====================== */}

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Berita</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10, marginBottom: 30 }}
      >
        {/* Card 1 */}
        <View style={styles.newsCard}>
          <Image
            source={require("../../assets/images/hero1.jpg")}
            style={styles.newsImage}
          />
          <View style={styles.newsTextBox}>
            <Text style={styles.newsTitle}>New Destinasi</Text>
            <View style={styles.rowCenter}>
              <Ionicons name="location-outline" size={14} />
              <Text style={styles.newsLocation}>Aceh</Text>
            </View>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.newsCard}>
          <Image
            source={require("../../assets/images/hero1.jpg")}
            style={styles.newsImage}
          />
          <View style={styles.newsTextBox}>
            <Text style={styles.newsTitle}>Destinasi Terbengkalai</Text>
            <View style={styles.rowCenter}>
              <Ionicons name="location-outline" size={14} />
              <Text style={styles.newsLocation}>Sibolga</Text>
            </View>
          </View>
        </View>

        {/* Card 3 */}
        <View style={styles.newsCard }>
          <Image
            source={require("../../assets/images/hero1.jpg")}
            style={styles.newsImage}
          />
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
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  headerBg: {
    height: 180,
    backgroundColor: "#007BFF",
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -70,
    alignSelf: "center",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  label: {
    color: "#777",
    fontSize: 13,
  },

  location: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    paddingHorizontal: 12,
    marginTop: 6,
  },

  input: {
    flex: 1,
    padding: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  searchBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },

  searchText: {
    color: "#fff",
    fontWeight: "600",
  },

  historyBtn: {
    fontSize: 14,
    fontWeight: "600",
  },

  sectionTitle: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "700",
  },


  favText: {
    marginTop: 8,
    marginLeft: 8,
    fontWeight: "600",
  },

  favLocation: {
    fontSize: 12,
    marginLeft: 4,
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
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

  destImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  destTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  destCount: {
    fontSize: 12,
    color: "#007BFF",
    marginTop: 2,
    fontWeight: "600",
  },

  destDesc: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },

  link: {
    color: "#007BFF",
    fontWeight: "700",
  },

  /* ================== */
  /*   BERITA SECTION   */
  /* ================== */

  newsCard: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginLeft: 20,
    padding: 10,
    elevation: 3,
    flexDirection: "column",
  },

  newsImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },

  newsTextBox: {
    marginTop: 10,
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  newsLocation: {
    fontSize: 12,
    marginLeft: 4,
  },

favCard: {
  marginLeft: 20,
  width: 200,
  backgroundColor: "#fff",
  borderRadius: 15,
  paddingBottom: 10,
  marginRight: 15,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  overflow: "hidden",
},

favImage: {
  width: "100%",
  height: 100,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
},



favTextBox: {
  padding: 8,
},

favTitle: {
  fontSize: 14,
  fontWeight: "700",
},

favDesc: {
  fontSize: 12,
  color: "#555",
  marginTop: 4,
},

favPrice: {
  fontSize: 12,
  fontWeight: "600",
  color: "#007BFF",
  marginTop: 4,
},

});
