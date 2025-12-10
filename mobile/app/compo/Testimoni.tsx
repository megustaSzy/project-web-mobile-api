import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // icon star
import { MaterialCommunityIcons } from "@expo/vector-icons"; // icon quote

export default function TestimoniSection({ user }) {
  const testimonials = [
    {
      id: 1,
      text: "Liburanku jadi luar biasa berkat layanan yang cepat dan ramah. Terima kasih banyak!",
      rating: 5,
    },
    {
      id: 2,
      text: "Tempatnya indah banget dan pelayanannya memuaskan. Pasti balik lagi deh!",
      rating: 5,
    },
    {
      id: 3,
      text: "Sangat puas dengan pengalaman wisata yang ditawarkan, recommended banget!",
      rating: 5,
    },
    {
      id: 4,
      text: "Perjalanan yang menyenangkan dan tidak terlupakan, terima kasih LamiGo!",
      rating: 5,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Testimoni</Text>

      <View style={styles.grid}>
        {testimonials.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Icon kutipan */}
            <MaterialCommunityIcons
              name="format-quote-close"
              size={30}
              color="#d1d5db"
              style={{ marginBottom: 6 }}
            />

            {/* Isi testimoni */}
            <Text style={styles.text}>{item.text}</Text>

            {/* Rating bintang */}
            <View style={styles.ratingRow}>
              {Array.from({ length: item.rating }).map((_, i) => (
                <AntDesign key={i} name="star" size={18} color="#facc15" />
              ))}
            </View>

            {/* Profil user */}
            <View style={styles.userRow}>
              <Image
                source={
                  user?.image
                    ? { uri: user.image }
                    : require("../../assets/images/faiz.jpg")
                }
                style={styles.avatar}
              />

              <View>
                <Text style={styles.username}>{user?.name || "User"}</Text>
                <Text style={styles.role}>{user?.role || "Traveler"}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dbe7f9",
    padding: 20,
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "column",
    gap: 16,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 3,
  },

  text: {
    color: "#4b5563",
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },

  ratingRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 4,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  username: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "600",
  },

  role: {
    color: "#6b7280",
    fontSize: 11,
  },
});
