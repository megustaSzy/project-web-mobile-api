import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function DetailTiketScreen({ route }: any) {
  const { id } = route.params;

  // Dummy data — nanti diganti fetch dari API/database
  const tiket = {
    id: id,
    destinasi: "Pantai Sari Ringgung",
    nama: "Muhammad Arif Alfa'iz",
    tanggal: "2025-11-20",
    jumlah: 2,
    code: `TIK-${id}ABC123`,
    status: "Sudah Dibayar",
  };

  const badgeColor =
    tiket.status === "Sudah Dibayar"
      ? styles.badgeSuccess
      : styles.badgeWaiting;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detail Tiket</Text>

      <View style={styles.card}>
        {/* KODE TIKET */}
        <Text style={styles.label}>Kode Tiket</Text>
        <Text style={styles.ticketCode}>{tiket.code}</Text>

        {/* INFORMASI */}
        <View style={styles.info}>
          <Text>Destinasi: {tiket.destinasi}</Text>
          <Text>Nama Pemesan: {tiket.nama}</Text>
          <Text>Tanggal Kunjungan: {tiket.tanggal}</Text>
          <Text>Jumlah Tiket: {tiket.jumlah}</Text>

          <View style={[styles.badge, badgeColor]}>
            <Text style={styles.badgeText}>{tiket.status}</Text>
          </View>
        </View>

        {/* QR CODE */}
        <View style={styles.qrWrapper}>
          <QRCode value={tiket.code} size={200} />
        </View>

        <Text style={styles.note}>
          Tunjukkan QR Code ini di loket untuk masuk
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
  ticketCode: {
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    marginTop: 10,
    gap: 4,
  },
  badge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: "#CFF9D9",
  },
  badgeWaiting: {
    backgroundColor: "#FFF2B3",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  qrWrapper: {
    marginTop: 20,
    alignItems: "center",
  },
  note: {
    textAlign: "center",
    marginTop: 10,
    color: "#777",
    fontSize: 13,
  },
});
