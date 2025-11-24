import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SearchCard from "./SearchCard"; // pastikan file ini ada
import { ScrollView } from "react-native";

const { width, height } = Dimensions.get("window");

const images = [
  require("../../assets/images/hero1.jpg"),
  require("../../assets/images/hero2.jpg"),
  require("../../assets/images/hero3.jpg"),
];


export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      
      {/* Background Slider */}
      <View style={styles.backgroundWrapper}>
        <Animated.View
          key={current}
          entering={FadeIn.duration(800)}
          exiting={FadeOut.duration(800)}
          style={styles.absoluteFill}
        >
          <ImageBackground
            source={images[current]}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
          </ImageBackground>
        </Animated.View>
      </View>

      {/* Hero Content */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/best.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>LamiGo Jelajah Alam Lampung</Text>

        <Text style={styles.subtitle}>
          Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket dengan mudah dalam satu aplikasi.
        </Text>

        {/* Pagination dots */}
        <View style={styles.dots}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                current === index && styles.dotActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* SearchCard */}
      <View style={styles.searchWrapper}>
        <SearchCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.9,
    width: "100%",
    justifyContent: "flex-end",
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "relative",
    zIndex: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 300,
    marginBottom: 15,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    backgroundColor: "#fff",
  },
  searchWrapper: {
    position: "absolute",
    bottom: -30,
    left: "5%",
    right: "5%",
    zIndex: 20,
  },
});
