import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export default function DaftarFavorite({ navigation }) {
  const wisataData = [
    {
      name: "Kabupaten Pesawaran",
      desc: "Temukan berbagai wisata di Kabupaten Pesawaran",
      total: 15,
      img: require("../../assets/images/favorite/19.png"),
    },
    {
      name: "Kabupaten Lampung Selatan",
      desc: "Temukan berbagai wisata di Kabupaten Lampung Selatan",
      total: 9,
      img: require("../../assets/images/favorite/20.png"),
    },
    {
      name: "Kabupaten Tanggamus",
      desc: "Temukan berbagai wisata di Kabupaten Tanggamus",
      total: 8,
      img: require("../../assets/images/favorite/24.png"),
    },
    {
      name: "Kabupaten Lampung Barat",
      desc: "Temukan berbagai wisata di Kabupaten Lampung Barat",
      total: 8,
      img: require("../../assets/images/favorite/21.png"),
    },
    {
      name: "Kabupaten Way Kanan",
      desc: "Temukan berbagai wisata di Kabupaten Way Kanan",
      total: 2,
      img: require("../../assets/images/favorite/23.png"),
    },
    {
      name: "Kabupaten Pesisir Barat",
      desc: "Temukan berbagai wisata di Kabupaten Pesisir Barat",
      total: 3,
      img: require("../../assets/images/favorite/22.png"),
    },
    {
      name: "Kabupaten Tulang Bawang Barat",
      desc: "Temukan berbagai wisata di Kabupaten Tulang Bawang Barat",
      total: 2,
      img: require("../../assets/images/favorite/26.png"),
    },
    {
      name: "Kota Bandar Lampung",
      desc: "Temukan berbagai wisata di Kota Bandar Lampung",
      total: 4,
      img: require("../../assets/images/favorite/25.png"),
    },
    {
      name: "Kabupaten Lampung Tengah",
      desc: "Temukan berbagai wisata di Kabupaten Lampung Tengah",
      total: 1,
      img: require("../../assets/images/favorite/27.png"),
    },
    {
      name: "Destinasi Belum Terklarifikasi",
      desc: "Destinasi berada di perbatasan / belum jelas administratif",
      total: 4,
      img: require("../../assets/images/favorite/28.png"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tujuan Wisata Favorit</Text>

      <View style={styles.cardWrap}>
        {wisataData.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() =>
              navigation.navigate("PemesananTour", {
                kabupaten: item.name,
              })
            }
          >
            <Image source={item.img} style={styles.image} />

            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>

              <Text style={styles.detailLink}>Lihat Detail</Text>
            </View>

            <View style={styles.totalWrap}>
              <Text style={styles.totalNumber}>{item.total}</Text>
              <Text style={styles.totalText}>Destinasi</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a7c8e7",
    paddingVertical: 25,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 18,
  },
  cardWrap: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: "flex-start",
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
    color: "#777",
  },
  detailLink: {
    marginTop: 6,
    fontSize: 13,
    color: "#1d4ed8",
    fontWeight: "500",
  },
  totalWrap: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  totalNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  totalText: {
    fontSize: 10,
    color: "#777",
    marginTop: -3,
  },
});
