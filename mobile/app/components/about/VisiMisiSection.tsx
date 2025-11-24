import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

export default function VisiMisiSection() {
  return (
    <ScrollView style={styles.container}>

      {/* Visi */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Visi</Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            Menjadi platform wisata digital yang berperan aktif dalam membangun
            ekosistem pariwisata Lampung yang maju, inklusif, dan berkelanjutan.
          </Text>
        </View>
      </View>

      {/* Misi */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Misi</Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            Mengembangkan teknologi yang memudahkan wisatawan menemukan dan
            menjelajahi destinasi di Lampung.
          </Text>

          <Text style={styles.text}>
            Mendorong kolaborasi antara wisatawan, pelaku lokal, dan pemerintah daerah.
          </Text>

          <Text style={styles.text}>
            Menyediakan layanan wisata yang aman, informatif, dan berorientasi
            pada kepuasan pengguna.
          </Text>

          <Text style={styles.text}>
            Menumbuhkan kesadaran akan pentingnya pelestarian alam dan budaya lokal.
          </Text>
        </View>
      </View>

      {/* Nilai Utama */}
      <Text style={styles.centerTitle}>Nilai Utama LamiGo</Text>

      {/* Grid Nilai */}
      <View style={styles.grid}>

        {/* Inovatif */}
        <View style={styles.cardRow}>
          <Image
            source={require("../../assets/images/14.png")}
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Inovatif</Text>
            <Text style={styles.cardText}>
              Selalu berinovasi untuk menciptakan pengalaman wisata yang relevan
              dengan perkembangan zaman.
            </Text>
          </View>
        </View>

        {/* Tanggung Jawab */}
        <View style={styles.cardRow}>
          <Image
            source={require("../../assets/images/15.png")}
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Tanggung Jawab</Text>
            <Text style={styles.cardText}>
              Berkomitmen menjaga kepercayaan pengguna dan mendukung pariwisata
              berkelanjutan.
            </Text>
          </View>
        </View>

        {/* Kolaboratif */}
        <View style={styles.cardRow}>
          <Image
            source={require("../../assets/images/17.png")}
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Kolaboratif</Text>
            <Text style={styles.cardText}>
              Membangun kerja sama dengan berbagai pihak demi kemajuan wisata daerah.
            </Text>
          </View>
        </View>

        {/* Cepat */}
        <View style={styles.cardRow}>
          <Image
            source={require("../../assets/images/18.png")}
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Cepat</Text>
            <Text style={styles.cardText}>
              Memberikan layanan yang responsif dan efisien untuk setiap kebutuhan wisatawan.
            </Text>
          </View>
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bfd8f7",
    padding: 20,
  },
  sectionWrapper: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0a1a35",
  },
  centerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0a1a35",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
    gap: 10,
  },
  text: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    gap: 20,
    marginBottom: 40,
  },
  cardRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
    gap: 15,
  },
  icon: {
    width: 70,
    height: 70,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 3,
  },
  cardText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});
