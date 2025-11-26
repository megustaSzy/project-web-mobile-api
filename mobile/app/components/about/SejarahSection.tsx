import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet, ScrollView } from "react-native";

export default function CeritaPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Background gradasi */}
      <ImageBackground
        source={require("../../../assets/images/tekturgaris.svg")} // sesuaikan path dan format gambar
        style={styles.background}
        imageStyle={{ opacity: 0.2 }}
      >
        <View style={styles.overlay} />

        {/* Konten */}
        <View style={styles.content}>
          
          {/* Teks */}
          <View style={styles.textBox}>
            <Text style={styles.title}>Sejarah LamiGo</Text>
            <Text style={styles.paragraph}>
              LamiGo lahir dari semangat menghadirkan pengalaman berwisata yang lebih terarah
              dan bermakna. Kami percaya bahwa setiap perjalanan bukan hanya tentang tempat
              yang dikunjungi, tetapi juga cerita yang dibawa pulang. Melalui inovasi digital,
              LamiGo menghubungkan keindahan alam Lampung dengan generasi muda yang mencintai
              eksplorasi.
            </Text>
          </View>

          {/* Gambar */}
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../../assets/images/16.svg")} // sesuaikan dengan lokasi file
              style={styles.image}
            />
          </View>

        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(173, 216, 255, 0.6)", // Soft blue gradient imitation
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  textBox: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1a1a1a",
  },
  paragraph: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  imageWrapper: {
    width: "100%",
    maxWidth: 450,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
  },
});
