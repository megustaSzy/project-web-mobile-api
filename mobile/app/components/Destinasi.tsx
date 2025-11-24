import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const categories = ["Pantai", "Pulau", "Gunung", "Air Terjun", "Bukit"];

const destinations = [
  {
    id: 1,
    name: "Rio The Beach",
    location: "Kalianda",
    image: require("../assets/images/hero1.jpg"),
    desc: "Pantai Rio The Beach menghadirkan keindahan pasir putih dan ombak tenang.",
    price: 120000,
    category: "Pantai",
  },
  {
    id: 2,
    name: "Senaya Beach",
    location: "Kalianda",
    image: require("../../assets/images/hero2.jpg"),
    desc: "Senaya Beach menawarkan panorama laut biru dan angin sejuk.",
    price: 120000,
    category: "Pantai",
  },
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    image: require("../../assets/images/hero3.jpg"),
    desc: "Green Elty Krakatoa menyajikan pemandangan laut yang menakjubkan.",
    price: 120000,
    category: "Pantai",
  },
];

export default function DestinasiSection() {
  const [activeCategory, setActiveCategory] = useState("Pantai");
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Judul */}
      <Text style={styles.title}>Tujuan Wisata Favorit</Text>

      {/* Filter Kategori */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryButton, isActive && styles.activeCategory]}
            >
              <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Card Destinasi */}
      <View style={styles.grid}>
        {destinations
          .filter((d) => d.category === activeCategory)
          .map((d) => (
            <View key={d.id} style={styles.card}>
              <Image source={d.image} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{d.name}</Text>
                <Text style={styles.location}>{d.location}</Text>
                <Text style={styles.desc}>{d.desc}</Text>

                <View style={styles.rowBetween}>
                  <TouchableOpacity
                    onPress={() => router.push(`/pesan?id=${d.id}`)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Pesan Sekarang</Text>
                  </TouchableOpacity>

                  <Text style={styles.price}>Rp.{d.price.toLocaleString("id-ID")},-</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f6f9",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 14,
    color: "#555",
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  grid: {
    gap: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  location: {
    color: "#666",
    marginBottom: 8,
    fontSize: 13,
  },
  desc: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  price: {
    color: "#000",
    fontWeight: "700",
  },
});
