import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SearchCard from "./SearchCard";

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
          entering={FadeIn.duration(600)}
          exiting={FadeOut.duration(600)}
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

      {/* Content */}
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

        {/* Dots */}
        <View style={styles.dots}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, current === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      {/* Search Box */}
      <View style={styles.searchWrapper}>
        <SearchCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.75, // lebih pas untuk Android (ukuran aman)
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
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    zIndex: 10,
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: Platform.OS === "android" ? 70 : 90,
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 330,
    marginBottom: 12,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    backgroundColor: "#fff",
  },
  searchWrapper: {
    position: "absolute",
    bottom: Platform.OS === "android" ? -20 : -30, 
    left: "5%",
    right: "5%",
    zIndex: 20,
  },
});
