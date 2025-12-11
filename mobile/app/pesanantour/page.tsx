import React, { useState } from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function KabupatenDetail() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("semua");

  const CATEGORY_DATA = [
    { id: 1, name: "Pantai", icon: require("../../assets/images/kategori1.png") },
    { id: 2, name: "Gunung", icon: require("../../assets/images/kategori2.png") },
    { id: 3, name: "Bukit", icon: require("../../assets/images/kategori3.png") },
    { id: 4, name: "Pulau", icon: require("../../assets/images/kategori4.png") },
    { id: 5, name: "Air Terjun", icon: require("../../assets/images/kategori5.png") },
  ];

  const kabupatenList = [
    {
      id: 1,
      name: "Kabupaten Tanggamus",
      description:
        "Kabupaten Tanggamus menawarkan pesona wisata alam beragam, mulai dari Teluk Kiluan hingga air terjun yang eksotis.",
      logo: require("../../assets/images/favorite/24.png"),
      hero: require("../../assets/images/hero3.jpg"),
    },
    {
      id: 2,
      name: "Kabupaten Lampung Selatan",
      description:
        "Lampung Selatan terkenal dengan wisata pantainya yang indah dan akses mudah ke Pulau Sebesi serta Krakatau.",
      logo: require("../../assets/images/favorite/20.png"),
      hero: require("../../assets/images/hero3.jpg"),
    },
  ];

  const [index, setIndex] = useState(0);
  const data = kabupatenList[index];

  const next = () => setIndex((prev) => (prev + 1) % kabupatenList.length);
  const prev = () => setIndex((prev) => (prev - 1 + kabupatenList.length) % kabupatenList.length);

  const handleCategoryPress = (name: React.SetStateAction<string>) => {
    setActiveCategory(name);
  };

  // Contoh data destinasi
  const destinations = [
    {
      id: 1,
      name: "Green Elty",
      location: "Kalianda, Lampung Selatan",
      image: require("../../assets/images/hero3.jpg"),
    },
    {
      id: 2,
      name: "Senaya Beach",
      location: "Kalianda, Lampung Selatan",
      image: require("../../assets/images/hero3.jpg"),
    },
    {
      id: 3,
      name: "Teluk Kiluan",
      location: "Tanggamus, Lampung",
      image: require("../../assets/images/hero3.jpg"),
    },
    {
      id: 4,
      name: "Air Terjun Way Lalaan",
      location: "Tanggamus, Lampung",
      image: require("../../assets/images/hero3.jpg"),
    },
  ];

  const handleDestinationPress = (destination: { id?: number; name: any; location?: string; image?: any; }) => {
    // Contoh navigasi
    console.log("Destination pressed:", destination.name);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* HERO SECTION */}
      <View>
        <ImageBackground source={data.hero} style={styles.heroImage}>
          <View style={styles.overlay} />

          <TouchableOpacity style={styles.arrowLeft} onPress={prev}>
            <Ionicons name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.arrowRight} onPress={next}>
            <Ionicons name="chevron-forward" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.logoWrapper}>
            <Image source={data.logo} style={styles.logo} resizeMode="contain" />
          </View>
        </ImageBackground>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.description}>{data.description}</Text>

        {/* CATEGORY */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15, paddingLeft: 12 }}>
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
                <Text style={[styles.categoryChipText, isActive ? { color: "#007BFF" } : { color: "#333" }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* POPULER DESTINATION */}
        <Text style={styles.sectionTitle}>Populer Destination</Text>
        <View style={styles.popularGrid}>
          {destinations.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => handleDestinationPress(d)}
              style={styles.popularItem}
            >
              <Image source={d.image} style={styles.popularBG} />
              <View style={styles.popularOverlay} />
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    height: 400,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 27, 56, 0.72)",
    position: "absolute",
    width: "100%",
    height: "100%",
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
    marginTop : 40,
  },

 content: {
  marginTop: -25, // agar menempel ke hero image
  backgroundColor: "#fff",
  borderTopLeftRadius: 35,   // radius top kiri
  borderTopRightRadius: 35,  // radius top kanan
  padding: 20,
  // Tambahan shadow untuk efek card (opsional)
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // untuk Android
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
    borderRadius: 35,
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
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginTop: 10,
  },
  popularItem: {
    width: "48%",
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
});
