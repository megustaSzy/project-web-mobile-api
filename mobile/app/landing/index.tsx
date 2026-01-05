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
import { Dropdown } from "react-native-element-dropdown";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

type DestinationType = {
  id: string | number;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  description: string;
  category?: {
    id?: number;
    name: string;
  };
};

type CategoryType = {
  id: number;
  name: string;
};

type AreaType = {
  id: number;
  nama: string;
};

type HistoryType = {
  kategori: string;
  daerah: string;
  date: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

  // ================= STATE =================
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [kategoriName, setKategoriName] = useState<string | null>(null);
  const [daerah, setDaerah] = useState<string | null>(null);

  const [apiCategories, setApiCategories] = useState<CategoryType[]>([]);
  const [apiDestinations, setApiDestinations] = useState<DestinationType[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationType[]>([]);
  const [apiAreas, setApiAreas] = useState<AreaType[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<HistoryType[]>([]);
  const [historyModal, setHistoryModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Memuat lokasi...");

  // ================= EFFECT =================
  useEffect(() => {
    loadHistory();
    getLocation();
    fetchCategories();
    fetchDestinations();
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!kategoriName) {
      setFilteredDestinations(apiDestinations);
      return;
    }

    const hasil = apiDestinations.filter(
      (item) => item.category?.name === kategoriName
    );

    setFilteredDestinations(hasil);
  }, [kategoriName, apiDestinations]);

  // ================= API =================
  const fetchCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/category`);
    const json = await res.json();

    let categories: CategoryType[] = [];

    if (Array.isArray(json)) {
      categories = json;
    } else if (Array.isArray(json.data)) {
      categories = json.data;
    } else if (Array.isArray(json.data?.items)) {
      categories = json.data.items;
    } else {
      console.log("FORMAT CATEGORY API TIDAK DIKENAL:", json);
    }

    setApiCategories(categories);
  } catch (e) {
    console.log("Category API error:", e);
    setApiCategories([]);
  }
};


  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/destinations`);
      const json = await res.json();
      setApiDestinations(json.data?.items || []);
      setFilteredDestinations(json.data?.items || []);
    } catch (e) {
      console.log("Destination API error:", e);
    }
  };

  const fetchAreas = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/region`);
    const json = await res.json();

    let areas: AreaType[] = [];

    if (json?.data?.items && Array.isArray(json.data.items)) {
      areas = json.data.items.map((item: any) => ({
        id: item.id,
        nama: item.name,
      }));
    } else {
      console.log("FORMAT REGION API TIDAK SESUAI:", json);
    }

    setApiAreas(areas);
  } catch (e) {
    console.log("Area API error:", e);
    setApiAreas([]);
  }
};



  // ================= LOCATION =================
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync(loc.coords);

      if (geo.length > 0) {
        const place = geo[0];
        setCurrentLocation(`${place.city || place.subregion}, ${place.region}`);
      }
    } catch {
      setCurrentLocation("Lokasi tidak tersedia");
    }
  };

  // ================= HISTORY =================
  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("searchHistory");
    if (data) setHistoryList(JSON.parse(data));
  };

  const saveHistory = async () => {
    if (!kategoriName || !daerah) return;

    const newData: HistoryType = {
      kategori: kategoriName,
      daerah,
      date: new Date().toLocaleString("id-ID"),
    };

    const updated = [newData, ...historyList];
    setHistoryList(updated);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // ================= HANDLER =================
  const handleCategoryPress = (name: string) => {
    if (activeCategory === name) {
      setActiveCategory(null);
      setKategoriName(null);
    } else {
      setActiveCategory(name);
      setKategoriName(name);
    }
  };

  const handleDestinationPress = (d: DestinationType) => {
    router.push(`../deskripsi/${d.id}`);
  };

  // ============================
  // RENDER UI
  // ============================
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/hero3.jpg")}
          style={styles.headerBg}
        />
        <View style={styles.headerOverlay} />
      </View>

      {/* CARD */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>Lokasi Kamu</Text>
        <Text style={styles.location}>{currentLocation}</Text>

        <View style={styles.row}>
          {/* KATEGORI DROPDOWN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kategori Wisata</Text>

            <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={apiCategories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Pilih Kategori"
            value={kategoriId}
            onChange={(item) => {
              setKategoriId(item.value);

              const selected = apiCategories.find(
                (c) => c.id === item.value
              );
              setKategoriName(selected?.name || null);
            }}
          />
          </View>

          {/* DAERAH DROPDOWN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daerah</Text>

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={apiAreas.map((a) => ({
                label: a.nama,
                value: a.id,   // ⬅️ GUNAKAN ID (PENTING)
              }))}
              labelField="label"
              valueField="value"
              placeholder="Pilih Daerah"
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
        </View>
      </View>

      {/* CATEGORY LIST */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 15, paddingLeft: 12 }}
      >
        {apiCategories.map((cat) => {
          const isActive = activeCategory === cat.name;

          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleCategoryPress(cat.name)}
              style={[
                styles.categoryChip,
                isActive
                  ? {
                      backgroundColor: "#007BFF",
                      borderColor: "#007BFF",
                      borderWidth: 2,
                    }
                  : {
                      backgroundColor: "#fff",
                      borderColor: "#000",
                      borderWidth: 1.2,
                    },
              ]}

            >
              <Image
                source={require("../../assets/images/kategori1.png")}
                style={styles.categoryIcon}
              />
              <Text
              style={[
                styles.categoryChipText,
                isActive ? { color: "#fff" } : { color: "#000" },
              ]}
            >
              {cat.name}
            </Text>

            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* POPULAR DESTINATION */}
      <Text style={styles.sectionTitle}>Populer Destination</Text>

      <View style={styles.popularGrid}>
        {filteredDestinations.map((d) => (
          <TouchableOpacity
            key={d.id}
            onPress={() => handleDestinationPress(d)}
            style={styles.popularItem}
          >
            <Image
              source={{ uri: `${BASE_URL}${d.imageUrl}` }}
              style={styles.popularBG}
            />

            <View style={styles.popularOverlay} />

            <View style={styles.popularContent}>
              <Text style={styles.popularTitle}>{d.name}</Text>
              <View style={styles.popularLocationRow}>
                <Ionicons name="location-sharp" size={14} color="#fff" />
                <Text style={styles.popularLocationText}>
                  {d.category?.name}
                </Text>
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
              <Text style={{ color: "#fff", fontWeight: "700" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    height: 270,
    width: "100%",
    position: "relative",
  },
  headerBg: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 27, 56, 0.72)", // #001B38 opacity 72%
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
},


  cardBox: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: -70,
    padding: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  label: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 3,
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#343A40",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inputGroup: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 5,
  },

  dropdown: {
    height: 45,
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#ADB5BD",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#212529",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },

  searchBtn: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 161,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchText: {
    color: "#fff",
    fontWeight: "700",
  },

  // CATEGORY
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  categoryChipText: {
    fontSize: 14,
    marginLeft: 6,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },

  // POPULAR
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 15,
  },

  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },

  popularItem: {
    width: "48%",
    height: 170,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },

  popularBG: {
    width: "100%",
    height: "100%",
  },
  popularOverlay: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  backgroundColor: "rgba(0,0,0,0.60)", // 70% opacity
},


  popularContent: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  popularTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  popularLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  popularLocationText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 3,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  historyText: {
    fontSize: 14,
  },
  historyDate: {
    fontSize: 12,
    color: "#6C757D",
  },

  closeBtn: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
