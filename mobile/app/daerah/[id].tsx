import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { wisata } from "../data/wisata";
import { Ionicons } from "@expo/vector-icons";

export default function DaerahPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // cari berdasarkan id, bukan array index!
  const daerah = wisata.find((item) => item.id == id);

  if (!daerah) {
    return (
      <View style={styles.center}>
        <Text>Data daerah tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Image source={daerah.logo} style={styles.logo} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{daerah.name}</Text>
        <Text style={styles.desc}>{daerah.description}</Text>

        <Text style={styles.subtitle}>Destination</Text>

        <View style={styles.categoryRow}>
          {daerah.kategori?.map((item, i) => (
            <TouchableOpacity key={i} style={styles.categoryBtn}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },

  backBtn: { position: "absolute", top: 55, left: 20 },

  logo: { width: 180, height: 220, resizeMode: "contain" },

  card: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  title: { fontSize: 20, fontWeight: "bold" },

  desc: { marginTop: 5, color: "#666", lineHeight: 20 },

  subtitle: { marginTop: 20, fontWeight: "bold", fontSize: 16 },

  categoryRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
    flexWrap: "wrap",
  },

  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#2F80ED",
    borderRadius: 20,
  },

  categoryText: { color: "#fff", fontWeight: "600" },

  cardDestinasi: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 15,
    marginTop: 15,
  },

  destImage: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },

  destTitle: { fontWeight: "bold", fontSize: 16 },

  destInfo: { color: "#666" },

  destSub: { color: "#777", fontSize: 12 },
});
