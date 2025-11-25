import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MapPin } from "lucide-react-native";
import { wisataByKabupaten } from "../data/wisata"; // sesuaikan path

const categories = ["Pantai", "Pulau", "Gunung", "Air Terjun", "Bukit"];

export default function PesananTourPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { kabupaten } = route.params ?? {};

  const [selectedCategory, setSelectedCategory] = useState("Pantai");

  if (!kabupaten) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>❗ Kabupaten tidak ditemukan.</Text>
      </View>
    );
  }

  const kabupatenData = wisataByKabupaten.find((item) =>
    kabupaten.toLowerCase().includes(item.kabupaten.toLowerCase())
  );

  if (!kabupatenData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          ❗ Tidak ada data wisata untuk {kabupaten}
        </Text>
      </View>
    );
  }

  const filteredDestinasi = kabupatenData.destinasi.filter(
    (d) => d.kategori.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Tujuan Wisata Favorit di {kabupatenData.kabupaten}
      </Text>

      {/* FILTER KATEGORI */}
      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.filterTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST WISATA */}
      <View style={styles.grid}>
        {filteredDestinasi.length === 0 ? (
          <Text style={styles.noData}>
            Tidak ada destinasi kategori {selectedCategory}
          </Text>
        ) : (
          filteredDestinasi.map((dest, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={
                  dest.image
                    ? require(`../assets/${dest.image}`)
                    : require("../assets/hero1.png")
                }
                style={styles.image}
              />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{dest.name}</Text>

                <View style={styles.locationRow}>
                  <MapPin size={16} color="#444" />
                  <Text style={styles.locationText}>
                    {kabupatenData.kabupaten}
                  </Text>
                </View>

                <Text style={styles.desc}>
                  {dest.deskripsi ?? "Tidak ada deskripsi."}
                </Text>

                <View style={styles.bottomRow}>
                  <TouchableOpacity
                    style={styles.orderButton}
                    onPress={() => navigation.navigate("Pesan")}
                  >
                    <Text style={styles.orderText}>Pesan Sekarang</Text>
                  </TouchableOpacity>

                  <Text style={styles.price}>Rp{dest.harga}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e4eff8",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#1f2937",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Filter
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
  },
  filterText: {
    fontSize: 13,
    color: "#374151",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "bold",
  },

  // Grid
  grid: {
    gap: 16,
  },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#555",
  },
  desc: {
    fontSize: 13,
    color: "#555",
    marginTop: 8,
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  orderText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
  price: {
    fontWeight: "bold",
    color: "#111",
  },
});

