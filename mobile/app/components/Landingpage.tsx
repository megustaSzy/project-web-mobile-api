import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      
      {/* Blue Header */}
      <View style={styles.headerBg} />

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Lokasi Kamu</Text>
        <Text style={styles.location}>Kota Bandar Lampung, Lampung</Text>

        <Text style={[styles.label, { marginTop: 15 }]}>Tujuan</Text>

        {/* Input tujuan */}
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Kalianda"
            placeholderTextColor="#777"
          />
        </View>

        {/* Buttons */}
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.historyBtn}>Cari Histori ➜</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tujuan Wisata Favorit */}
      <Text style={styles.sectionTitle}>Tujuan Wisata Favorit</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 15, marginBottom: 10 }}
      >
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <View key={i} style={styles.favCard}>
              <Image
                source={require("../../assets/images/hero1.jpg")}
                style={styles.favImage}
              />
              <Text style={styles.favText}>Green Elty Krakatoa</Text>
              <View style={styles.rowCenter}>
                <Ionicons name="location-outline" size={14} />
                <Text style={styles.favLocation}>Kalianda</Text>
              </View>
            </View>
          ))}
      </ScrollView>

      {/* Daftar Destinasi */}
      <Text style={styles.sectionTitle}>Tujuan Wisata Favorit</Text>
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

      <TouchableOpacity style={{ marginTop: 6 }}>
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

      <TouchableOpacity style={{ marginTop: 6 }}>
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
        <View style={styles.newsCard}>
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

  favCard: {
    marginLeft: 20,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingBottom: 10,
    marginRight: 10,
    elevation: 3,
  },

  favImage: {
    width: "100%",
    height: 90,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
});
