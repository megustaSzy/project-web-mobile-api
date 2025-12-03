import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function ChooseUs() {
  const items = [
    {
      img: require("../../assets/images/1.png"),
      value: "100+",
      desc: "Perjalanan — Beri rating perjalananmu dan bantu wisatawan lain",
    },
    {
      img: require("../../assets/images/2.png"),
      value: "99+",
      desc: "Pengalaman — Bagikan pengalamanmu dan bantu wisatawan lain",
    },
    {
      img: require("../../assets/images/3.png"),
      value: "100+",
      desc: "Bahagia — Sebarkan momen bahagiamu bersama wisatawan",
    },
    {
      img: require("../../assets/images/4.png"),
      value: "89%",
      desc: "Rating — Tunjukkan rating bahagiamu dari pengalaman seru",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Judul */}
      <Text style={styles.title}>
        Mengapa <Text style={styles.highlight}>Memilih</Text> Kami
      </Text>

      <Text style={styles.subtitle}>
        Layanan profesional, harga bersahabat, dan perjalanan penuh kenangan
        bersama <Text style={styles.brand}>LamiGo</Text>
      </Text>

      <View style={styles.contentWrapper}>
        {/* Gambar */}
        <Image
          source={require("../../assets/images/5.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* List items */}
        <View style={styles.listWrapper}>
          {items.map((item, i) => {
            const parts = item.desc.split("—");
            const title = (parts[0] || "").trim();
            const description = (parts[1] || "").trim();

            return (
              <View key={i} style={styles.card}>
                <Image source={item.img} style={styles.icon} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.value}>{item.value}</Text>

                  <Text style={styles.descTitle}>{title}</Text>
                  <Text style={styles.descText}>{description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "800",
    color: "#111827",
  },
  highlight: {
    color: "#2563eb",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 20,
    fontSize: 13,
  },
  brand: {
    color: "#3b82f6",
    fontWeight: "600",
  },

  contentWrapper: {
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },

  heroImage: {
    width: "90%",
    height: 250,
    marginBottom: 20,
  },

  listWrapper: {
    width: "100%",
    gap: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
    marginBottom: 10,
  },

  icon: {
    width: 48,
    height: 48,
    marginRight: 14,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  descTitle: {
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 2,
  },
  descText: {
    color: "#4b5563",
    fontSize: 12,
    marginTop: 1,
  },
});
