import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { apiFetch } from "@/helpers/api";

const PLACEHOLDER_IMAGE = require("../../assets/images/placeholder.png");

type CategoryType = {
  id: number;
  name: string;
  icon: any;
};

type RegionType = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
};

type DestinationType = {
  id: number;
  name: string;
  imageUrl?: string;
  category: { id: number; name: string };
  region: { id: number; name: string };
};

export default function KabupatenDetail() {
  const router = useRouter();

  const [regions, setRegions] = useState<RegionType[]>([]);
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const CATEGORY_DATA: CategoryType[] = [
    { id: 0, name: "semua", icon: PLACEHOLDER_IMAGE },
    { id: 1, name: "Pantai", icon: PLACEHOLDER_IMAGE },
    { id: 2, name: "Gunung", icon: PLACEHOLDER_IMAGE },
    { id: 3, name: "Bukit", icon: PLACEHOLDER_IMAGE },
    { id: 4, name: "Pulau", icon: PLACEHOLDER_IMAGE },
    { id: 5, name: "Air Terjun", icon: PLACEHOLDER_IMAGE },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const regionRes = await apiFetch<any>("/api/region");
        setRegions(regionRes.data.items);

        const destRes = await apiFetch<any>("/api/destinations");
        setDestinations(destRes.data.items);
      } catch (err) {
        console.log("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const currentRegion = regions[index];

  /** ✅ FILTER YANG BENAR */
  const filteredDestinations = destinations.filter((d) => {
    const matchRegion = currentRegion
      ? d.region.id === currentRegion.id
      : true;

    const matchCategory =
      activeCategory === null
        ? true
        : d.category?.name === activeCategory;

    return matchRegion && matchCategory;
  });

  /** ✅ HANDLER TANPA TOGGLE (WAJIB) */
  const handleCategoryPress = (name: string) => {
    if (name === "semua") {
      setActiveCategory(null);
    } else {
      setActiveCategory(name);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentRegion) return null;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* HERO */}
      <ImageBackground
        source={require("../../assets/images/hero3.jpg")}
        style={styles.heroImage}
      >
        <View style={styles.overlay} />

        <TouchableOpacity
          style={styles.arrowLeft}
          onPress={() =>
            setIndex((prev) => (prev - 1 + regions.length) % regions.length)
          }
        >
          <Ionicons name="chevron-back" size={32} color="#007bff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrowRight}
          onPress={() =>
            setIndex((prev) => (prev + 1) % regions.length)
          }
        >
          <Ionicons name="chevron-forward" size={32} color="#007bff" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Image
            source={
              currentRegion.imageUrl
                ? { uri: currentRegion.imageUrl }
                : PLACEHOLDER_IMAGE
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>{currentRegion.name}</Text>

        <Text style={styles.description}>
          {currentRegion.description || "Deskripsi belum tersedia"}
        </Text>

        {/* CATEGORY LIST */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15, paddingLeft: 12 }}
        >
          {CATEGORY_DATA.map((cat) => {
            const isActive =
              (cat.name === "semua" && activeCategory === null) ||
              activeCategory === cat.name;

            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat.name)}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DESTINATION */}
        <Text style={styles.sectionTitle}>Populer Destination</Text>
        <View style={styles.popularGrid}>
          {filteredDestinations.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyContainer}>
              <Ionicons name="image-outline" size={64} color="#bbb" />
              <Text style={styles.emptyTitle}>Destinasi belum tersedia</Text>
              <Text style={styles.emptySubtitle}>
                Belum ada destinasi untuk kategori ini
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.popularGrid}>
            {filteredDestinations.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.popularItem}
                onPress={() => router.push(`../deskripsi/${d.id}`)}
              >
                <Image
                  source={d.imageUrl ? { uri: d.imageUrl } : PLACEHOLDER_IMAGE}
                  style={styles.popularBG}
                />
                <View style={styles.popularOverlay} />
                <View style={styles.popularContent}>
                  <Text style={styles.popularTitle}>{d.name}</Text>
                  <View style={styles.popularLocationRow}>
                    <Ionicons name="location-sharp" size={14} color="#fff" />
                    <Text style={styles.popularLocationText}>
                      {d.region.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  heroImage: {
    height: 400,
    justifyContent: "center",
    paddingBottom: 30,
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 100)",
    position: "absolute",
    width: "100%",
    height: 400,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
  logoWrapper: {
    alignSelf: "center",
    marginTop: 40,
  },
  logo: {
    width: 300,
    height: 300,
    marginTop : 60,
  },

  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingTop: 10,
    marginTop: -10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001B38",
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#007BFF", // outline biru
    backgroundColor: "#fff", // putih saat tidak aktif
  },

  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007BFF", // teks biru
  },

  categoryChipActive: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },

  categoryChipTextActive: {
    color: "#fff",
  },

  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginTop: 10,
  },
  popularItem: {
    width: 180,
    height: 210,
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

  emptyWrapper: {
  height: 260,          // tinggi area destinasi
  justifyContent: "center",
  alignItems: "center",
    },

    emptyContainer: {
      alignItems: "center",
    },

    emptyTitle: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: "600",
      color: "#555",
    },

    emptySubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: "#999",
      textAlign: "center",
    },

});

