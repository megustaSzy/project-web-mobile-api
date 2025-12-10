import React from "react";
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function FooterMobile() {
  return (
    <LinearGradient
      colors={["#0c1220", "#0c1220"]}
      style={styles.footer}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* Logo & Lokasi */}
        <View style={styles.section}>
          <View style={styles.logoRow}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
            <Text style={styles.logoTitle}>LamiGo Destination Lampung</Text>
          </View>
          <Text style={styles.textMuted}>
            Kota Bandar Lampung, Lampung {"\n"}Indonesia
          </Text>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          {["About LamiGo", "About LamiGo", "About LamiGo", "About LamiGo"].map(
            (item, index) => (
              <TouchableOpacity key={index}>
                <Text style={styles.linkText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Top Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Destination</Text>
          {["Rio The Beach", "Pahawang", "Green Ely Krakatoa", "Senaya Beach", "Marina Beach"].map(
            (item, index) => (
              <TouchableOpacity key={index}>
                <Text style={styles.linkText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>

          {/* WhatsApp */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("https://wa.me/6285100889876")}
          >
            <Image source={require("../../assets/images/8.png")} style={styles.icon} />
            <View>
              <Text style={styles.textMuted}>Whatsapp</Text>
              <Text style={styles.contactText}>+62851 0088 9876</Text>
            </View>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("mailto:LamiGoLampung.com")}
          >
            <Image source={require("../../assets/images/9.png")} style={styles.icon} />
            <View>
              <Text style={styles.textMuted}>Email</Text>
              <Text style={styles.contactText}>LamiGoLampung.com</Text>
            </View>
          </TouchableOpacity>

          {/* Telepon */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("tel:087688009876")}
          >
            <Image source={require("../../assets/images/10.png")} style={styles.icon} />
            <View>
              <Text style={styles.textMuted}>Telpon</Text>
              <Text style={styles.contactText}>0876 8800 9876</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          Copyright LamiGo 2025
        </Text>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  section: {
    marginBottom: 30,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },

  logoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },

  textMuted: {
    color: "#b0b9c9",
    fontSize: 13,
    marginTop: 5,
  },

  linkText: {
    color: "#b0b9c9",
    fontSize: 13,
    marginBottom: 6,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },

  icon: {
    width: 22,
    height: 22,
    marginTop: 2,
  },

  contactText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  copyright: {
    textAlign: "center",
    color: "#7b8496",
    marginTop: 10,
    fontSize: 12,
  },
});
