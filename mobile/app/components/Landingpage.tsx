import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ============================
// FORMAT RUPIAH
// ============================
const formatRupiah = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(String(v).replace(/[^\d]/g, "")));

// ============================
// DUMMY DATA
// ============================
const destinations = [
  {
    id: 1,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    price: 25000,
    image: require("../../assets/images/hero3.jpg"),
  },
  {
    id: 2,
    name: "Pantai Sari Ringgung",
    location: "Pesawaran",
    price: 15000,
    image: require("../../assets/images/hero3.jpg"),
  },
  {
    id: 3,
    name: "Pahawang Island",
    location: "Pesawaran",
    price: 50000,
    image: require("../../assets/images/hero3.jpg"),
  },
];

const kabupatenList = [
  {
    id: 1,
    name: "Kabupaten Tanggamus",
    desc: "Pesona wisata alam beragam...",
    image: require("../../assets/images/favorite/21.png"),
    count: 12,
  },
  {
    id: 2,
    name: "Kabupaten Lampung Selatan",
    desc: "Destinasi pantai & gunung populer...",
    image: require("../../assets/images/favorite/21.png"),
    count: 18,
  },
  {
    id: 3,
    name: "Kabupaten Pesawaran",
    desc: "Pulau-pulau cantik dan snorkeling...",
    image: require("../../assets/images/favorite/21.png"),
    count: 22,
  },
];

const CATEGORIES = ["Pantai", "Gunung", "Pulau", "Air Terjun"];

export default function HomeScreen() {
  const [kategori, setKategori] = useState("");
  const [daerah, setDaerah] = useState("");
  const [historyModal, setHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // LOAD HISTORY
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("searchHistory");
      if (data) setHistoryList(JSON.parse(data));
    } catch (e) {
      console.log("loadHistory error", e);
    }
  };

  // SAVE HISTORY
  const saveHistory = async () => {
    if (kategori.trim() === "" || daerah.trim() === "") return;

    const newData = {
      kategori,
      daerah,
      date: new Date().toLocaleString("id-ID"),
    };

    const updated = [newData, ...historyList];
    setHistoryList(updated);

    try {
      await AsyncStorage.setItem("searchHistory", JSON.stringify(updated));
      alert("Pencarian disimpan ke history!");
    } catch (e) {
      console.log("saveHistory error", e);
    }
  };

  const handleCategoryPress = (cat) => {
    // toggle: jika klik kategori yang sama, batalkan
    if (activeCategory === cat) {
      setActiveCategory(null);
      setKategori("");
    } else {
      setActiveCategory(cat);
      setKategori(cat);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Watchly.png")}
          style={styles.headerMainImage}
        />
      </View>

      {/* CARD */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>Lokasi Kamu</Text>
        <Text style={styles.location}>Kota Bandar Lampung , Lampung</Text>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kategori Wisata</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#555" />
              <TextInput
                placeholder="Pantai"
                value={kategori}
                onChangeText={(t) => {
                  setKategori(t);
                  // jika user ketik manual, reset activeCategory
                  if (activeCategory && activeCategory !== t) setActiveCategory(null);
                }}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daerah</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#555" />
              <TextInput
                placeholder="Tanggamus"
                value={daerah}
                onChangeText={setDaerah}
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.searchBtn} onPress={saveHistory}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setHistoryModal(true)}>
            <Text style={styles.historyBtn}>Histori</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CATEGORY (horizontal) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 15, paddingLeft: 12 }}
      >
        {CATEGORIES.map((cat, i) => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleCategoryPress(cat)}
              style={[
                styles.categoryChip,
                isActive
                  ? { backgroundColor: "white", borderWidth: 2, borderColor: "#007BFF" }
                  : { backgroundColor: "#DDEBFF", borderWidth: 0 },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isActive ? { color: "#007BFF" } : { color: "#007BFF" },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* KABUPATEN */}
      <Text style={styles.sectionTitle}>Daerah Wisata</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10, paddingLeft: 20 }}
      >
        {kabupatenList.map((item) => (
          <View key={item.id} style={styles.kabupatenCardHorizontal}>
            <Image source={item.image} style={styles.kabupatenImageH} />

            <View style={{ flex: 1 }}>
              <Text style={styles.kabupatenTitleH}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.kabupatenDescH}>
                {item.desc}
              </Text>
            </View>

            <View style={styles.kabupatenCountBoxH}>
              <Text style={styles.kabupatenCount}>{item.count}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* POPULAR */}
      <Text style={styles.sectionTitle}>Populer Destination</Text>

      {destinations.map((d) => (
        <View key={d.id} style={styles.popularCard}>
          {/* image fixed height */}
          <Image source={d.image} style={styles.popularImage} />

          {/* gradient overlay: from RIGHT (white) -> LEFT (transparent) */}
          <LinearGradient
            colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientOverlay}
          />

          <View style={styles.popularInfo}>
            <Text style={styles.popularName}>{d.name}</Text>
            <Text style={styles.popularLocation}>{d.location}</Text>

            {/* include text */}
            <Text style={styles.popularInclude}>
              Include: Tiket masuk | Travel Lamigo | Snack
            </Text>
          </View>
        </View>
      ))}

      {/* MODAL HISTORY */}
      <Modal visible={historyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Riwayat Pencarian</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {historyList.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    {h.kategori} - {h.daerah}
                  </Text>
                  <Text style={styles.historyDate}>{h.date}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setHistoryModal(false)}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ============================
// STYLES
// ============================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },

  header: {
    height: 230,
    backgroundColor: "#007BFF",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },

  headerMainImage: {
    width: 300,
    height: 180,
    resizeMode: "contain",
  },

  cardBox: {
    backgroundColor: "#fff",
    marginTop: -30,
    alignSelf: "center",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  label: { color: "#777", fontSize: 13 },
  location: { fontSize: 16, fontWeight: "600", marginTop: 2 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },

  inputGroup: { width: "48%" },
  inputLabel: { fontSize: 12, color: "#666", marginBottom: 6 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 1,
  },

  input: { flex: 1, marginLeft: 10 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  searchBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 30,
  },

  searchText: { color: "#fff", fontWeight: "600" },

  historyBtn: { fontSize: 14, fontWeight: "600" },

  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
    fontWeight: "700",
  },

  kabupatenCardHorizontal: {
    backgroundColor: "white",
    width: 360,
    marginRight: 19,
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  kabupatenImageH: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
  },

  kabupatenTitleH: { fontSize: 15, fontWeight: "700" },
  kabupatenDescH: { fontSize: 12, color: "#555", marginTop: 4 },

  kabupatenCountBoxH: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EAF3FF",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  kabupatenCount: { color: "#007BFF", fontWeight: "700", fontSize: 18 },

  /* POPULAR CARD */
  popularCard: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 0,
    marginTop: 10,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
    height: 90, // fixed height so gradient & image align
    padding: 0,
  },

  popularImage: {
    width: 110,
    height: "100%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    resizeMode: "cover",
  },

  gradientOverlay: {
    position: "absolute",
    right: 255,
    top: 0,
    bottom: 0,
    width: "20%",
    // LinearGradient paints the actual gradient
  },

  popularInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
    paddingRight: 12,
  },

  popularName: { fontSize: 16, fontWeight: "700" },
  popularLocation: { fontSize: 13, color: "#777" },
  popularPrice: { fontSize: 14, marginTop: 4, color: "#007BFF", fontWeight: "700" },

  popularInclude: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },

  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  historyText: { fontSize: 15, fontWeight: "600" },
  historyDate: { fontSize: 12, color: "#777" },

  closeBtn: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007BFF",
  },
});
