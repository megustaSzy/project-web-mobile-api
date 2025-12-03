import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

export default function CeritaPage() {
  const [rating, setRating] = useState(0);

  const handleFullStar = (value: number) => {
    setRating(value);
  };

  const handleHalfStar = (value: number) => {
    setRating(value - 0.5);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#dbeafe", "#bfdbfe", "#93c5fd"]}
        style={styles.container}
      >
        {/* Judul */}
        <View style={styles.header}>
          <Text style={styles.title}>Ceritakan Momen Serumumu</Text>

          <Text style={styles.subtitle}>
            Bagikan pengalaman bahagiamu bersama{" "}
            <Text style={{ color: "#2563eb", fontWeight: "700" }}>LamiGo</Text>
            .
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formBox}>
          <TextInput
            placeholder="Nama"
            style={styles.input}
            placeholderTextColor="#777"
          />

          <TextInput
            placeholder="Status"
            style={styles.input}
            placeholderTextColor="#777"
          />

          <TextInput
            placeholder="Komentar"
            style={[styles.input, { height: 100, paddingTop: 10 }]}
            placeholderTextColor="#777"
            multiline
          />

          {/* RATING */}
          <View style={styles.ratingBox}>
            <Text style={styles.ratingTitle}>Beri Rating</Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isFull = value <= rating;
                const isHalf = rating + 0.5 === value;

                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleFullStar(value)}
                    onLongPress={() => handleHalfStar(value)}
                  >
                    <View>
                      {/* Base star */}
                      <AntDesign name="staro" size={34} color="#d1d5db" />

                      {/* Full star */}
                      {isFull && (
                        <AntDesign
                          name="star"
                          size={34}
                          color="#facc15"
                          style={styles.fullStar}
                        />
                      )}

                      {/* Half star */}
                      {isHalf && (
                        <AntDesign
                          name="star"
                          size={34}
                          color="#facc15"
                          style={[styles.fullStar, styles.halfClip]}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.ratingText}>
              {rating > 0
                ? `Rating kamu: ${rating} / 5`
                : "Tap = 1 bintang • Long press = setengah bintang"}
            </Text>
          </View>

          {/* Tombol */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Kirim</Text>
          </TouchableOpacity>
        </View>

        {/* Gambar */}
        <View style={styles.imageBox}>
          <Image
            source={require("../../assets/images/test.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  formBox: {
    backgroundColor: "#ffffffd9",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 14,
    color: "#111",
  },

  ratingBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },

  ratingTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#374151",
  },

  starRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 10,
  },

  fullStar: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  halfClip: {
    width: 17,
    overflow: "hidden",
  },

  ratingText: {
    textAlign: "center",
    fontSize: 13,
    color: "#4b5563",
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  imageBox: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  heroImage: {
    width: 300,
    height: 300,
  },
});
