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
import isEqual from "lodash/isEqual";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
// import { wisata } from "../data/wisata";
import { Dropdown } from "react-native-element-dropdown";




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
    imageUri: "../../assets/images/favorite/21.png",
    count: 18,
  },
  {
    id: 3,
    name: "Kabupaten Pesawaran",
    desc: "Pulau-pulau cantik dan snorkeling...",
    image: require("../../assets/images/favorite/21.png"),
    imageUri: "../../assets/images/favorite/21.png",
    count: 22,
  },
];

const CATEGORY_DATA = [
  { id: 1, name: "Pantai", icon: require("../../assets/images/kategori1.png") },
  { id: 2, name: "Gunung", icon: require("../../assets/images/kategori2.png") },
  { id: 3, name: "Bukit", icon: require("../../assets/images/kategori3.png") },
  { id: 4, name: "Pulau", icon: require("../../assets/images/kategori4.png") },
  { id: 5, name: "Air Terjun", icon: require("../../assets/images/kategori5.png") },
];
const CATEGORIES = ["Pantai", "Gunung", "Pulau", "Air Terjun"];

// Untuk Dropdown Kategori
const kategoriList = [
  { label: "Pantai", value: "Pantai" },
  { label: "Gunung", value: "Gunung" },
  { label: "Pulau", value: "Pulau" },
  { label: "Air Terjun", value: "Air Terjun" },
];

// Untuk Dropdown Daerah
const daerahList = [
  { label: "Bandar Lampung", value: "Bandar Lampung" },
  { label: "Pesawaran", value: "Pesawaran" },
  { label: "Lampung Selatan", value: "Lampung Selatan" },
  { label: "Tanggamus", value: "Tanggamus" },
];

// ===============================
// MAIN COMPONENT
// ===============================
export default function HomeScreen() {
  const router = useRouter();

  const [kategori, setKategori] = useState("");
  const [daerah, setDaerah] = useState("");
  const [historyModal, setHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // ===============================
  // LOAD HISTORY
  // ===============================
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

  // ===============================
  // SAVE HISTORY
  // ===============================
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

  // ===============================
  // HANDLE CATEGORY PRESS
  // ===============================
  const handleCategoryPress = (cat) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      setKategori("");
    } else {
      setActiveCategory(cat);
      setKategori(cat);
    }
  };

  // ===============================
  // HANDLE DESTINATION CLICK
  // ===============================
  const handleDestinationPress = (d) => {
    router.push(`../deskripsi/${d.id}`);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
     <View style={styles.header}>
  {/* Background Image */}
  <Image
    source={require("../../assets/images/hero3.jpg")}
    style={styles.headerBg}
  />

  {/* Overlay warna biru tua */}
  <View style={styles.headerOverlay} />
</View>


      {/* CARD */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>Lokasi Kamu</Text>
        <Text style={styles.location}>Kota Bandar Lampung , Lampung</Text>


<View style={styles.row}>

  {/* Kategori Wisata */}
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>Kategori Wisata</Text>

    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={kategoriList}        // ← dari API
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Pilih Kategori"
      searchPlaceholder="Cari kategori..."
      value={kategori}
      onChange={(item) => {
        setKategori(item.value);
        setActiveCategory(null);
      }}
    />
  </View>

  {/* Daerah */}
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>Daerah</Text>

    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={daerahList}         // ← dari API
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Pilih Daerah"
      searchPlaceholder="Cari daerah..."
      value={daerah}
      onChange={(item) => {
        setDaerah(item.value);
      }}
    />
  </View>

</View>


        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.searchBtn} onPress={saveHistory}>
            <Text style={styles.searchText}>Cari</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => setHistoryModal(true)}>
            <Text style={styles.historyBtn}>Histori</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* CATEGORY */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 15, paddingLeft: 12 }}
      >
        {CATEGORY_DATA.map((cat) => {
  const isActive = activeCategory === cat.name;
  return (
    <TouchableOpacity
      key={cat.id}
      onPress={() => handleCategoryPress(cat.name)}
      style={[
        styles.categoryChip,
        isActive
          ? { backgroundColor: "#007BFF20", borderColor: "#007BFF", borderWidth: 2 }
          : { backgroundColor: "#fff" },
      ]}
    >
      <Image source={cat.icon} style={styles.categoryIcon} />
      <Text
        style={[
          styles.categoryChipText,
          isActive ? { color: "#007BFF" } : { color: "#333" },
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );
})}

      </ScrollView>

      {/* KABUPATEN
      <Text style={styles.sectionTitle}>Daerah Wisata</Text>

      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginTop: 10, paddingLeft: 20 }}
>
  {kabupatenList.map((item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.kabupatenCardHorizontal}
      onPress={() =>
        router.push({
          pathname: "../daerah/[id]",
          params: {
            id: item.id.toString(),
            name: item.name,
            desc: item.desc,
            image: item.imageUri, // jika pakai require tidak bisa dikirim
          },
        })
      }
    >
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
    </TouchableOpacity>
  ))}
</ScrollView> */}


      {/* POPULAR */}
      <Text style={styles.sectionTitle}>Populer Destination</Text>
     <View style={styles.popularGrid}>
  {destinations.map((d) => (
    <TouchableOpacity
      key={d.id}
      onPress={() => handleDestinationPress(d)}
      style={styles.popularItem}
    >
      {/* Background image */}
      <Image source={d.image} style={styles.popularBG} />

      {/* Overlay hitam */}
      <View style={styles.popularOverlay} />

      {/* Text content */}
      <View style={styles.popularContent}>
        <Text style={styles.popularTitle}>{d.name}</Text>

        <View style={styles.popularLocationRow}>
          <Ionicons name="location-sharp" size={14} color="#fff" />
          <Text style={styles.popularLocationText}>{d.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ))}
</View>



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
  height: 280,
  width: "100%",
  position: "relative",
  justifyContent: "flex-end",
  paddingBottom: 20,
},

headerBg: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},

headerOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 27, 56, 0.72)",
},


headerContent: {
  paddingLeft: 25,
},

headerHi: {
  color: "#fff",
  fontSize: 14,
  opacity: 0.9,
},

headerName: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700",
  marginTop: 4,
},


  cardBox: {
    backgroundColor: "#fff",
    marginTop: -120,
    alignSelf: "center",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  label: { color: "#777", fontSize: 15 },
  location: { fontSize: 20, fontWeight: "600", marginTop: 2 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },

  inputGroup: { width: "48%" },
  inputLabel: { fontSize: 15, color: "#666", marginBottom: 6 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  input: { flex: 1, marginLeft: 10 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  searchBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 150,
    borderRadius: 15,
    alignItems: "center",
  },

  searchText: { fontSize : 14, color: "#fff", fontWeight: "600" },

  historyBtn: { fontSize: 14, fontWeight: "600" },

  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
    fontWeight: "700",
  },

  kabupatenCardHorizontal: {
    backgroundColor: "white",
    width: 370,
    marginRight: 19,
    borderRadius: 10,
    padding: 0,
    paddingTop: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  kabupatenImageH: {
    width: 70,
    height: 70,
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

popularGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  marginTop: 10,
},

popularItem: {
  width: "48%",
  height: 190,
  borderRadius: 15,
  overflow: "hidden",
  marginBottom: 15,
  position: "relative",
  backgroundColor: "#000",
},

popularBG: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
  position: "absolute",
},

popularOverlay: {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
},

popularContent: {
  position: "absolute",
  bottom: 12,
  left: 10,
  right: 10,
},

popularTitle: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "700",
},

popularLocationRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 3,
},

popularLocationText: {
  color: "#fff",
  marginLeft: 4,
  fontSize: 13,
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
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 25,
  marginRight: 12,
  borderWidth: 1,
  borderColor: "#eee",
},

categoryIcon: {
  width: 26,
  height: 26,
  resizeMode: "contain",
  marginRight: 8,
},

categoryChipText: {
  fontSize: 14,
  fontWeight: "600",
},

dropdown: {
  height: 48,
  backgroundColor: "#fff",
  borderRadius: 8,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: "#ccc",
  marginTop: 4,
},

placeholderStyle: {
  fontSize: 14,
  color: "#888",
},

selectedTextStyle: {
  fontSize: 14,
  color: "#000",
},

inputSearchStyle: {
  height: 40,
  fontSize: 14,
  borderRadius: 8,
},

iconStyle: {
  width: 20,
  height: 20,
},


});
