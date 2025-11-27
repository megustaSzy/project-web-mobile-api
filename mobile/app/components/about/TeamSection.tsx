import React from "react";
import { View, Text, Image, StyleSheet, ScrollView ,ImageBackground} from "react-native";
// import MapView, { Marker } from "react-native-maps";

export default function TeamSection() {
  return (
    <ScrollView style={styles.container}>
      {/* Judul */}
      <Text style={styles.title}>Our Team</Text>

      {/* Cards */}
      <View style={styles.teamWrapper}>

        {/* Member 1 */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/images/faiz.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.name}>M. Arif Alfa’iz</Text>
          <Text style={styles.role}>UIUX Design & Frontend Developer</Text>
        </View>

        {/* Member 2 */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/images/faiz.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.name}>Fadly Mustofainal A.</Text>
          <Text style={styles.role}>UIUX Design & Frontend Developer</Text>
        </View>

        {/* Member 3 */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/images/boute.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.name}>Raditya Ahmad</Text>
          <Text style={styles.role}>Backend Developer</Text>
        </View>

      </View>

      {/* Maps */}
      <Text style={styles.mapTitle}>Lokasi Universitas Teknokrat</Text>

      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: -5.38273375,
          longitude: 105.26573777,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: -5.38273375,
            longitude: 105.26573777,
          }}
          title="Universitas Teknokrat Indonesia"
        />
      </MapView> */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bfd8f7",
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  teamWrapper: {
    width: "100%",
    alignItems: "center",
    gap: 30,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#0a1a35",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: "80%",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 30,
    backgroundColor: "#FFD700",
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  role: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    marginTop: 4,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
    color: "#000",
  },
  map: {
    width: "90%",
    height: 300,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
});
