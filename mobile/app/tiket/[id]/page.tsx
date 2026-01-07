import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams } from "expo-router";

export default function DetailTiketPage() {
  const { id } = useLocalSearchParams();

  /* Dummy data — nanti ganti fetch API */
  const tiket = {
    id,
    destinasi: "Pantai Sari Ringgung",
    nama: "Muhammad Arif Alfa'iz",
    tanggal: "2025-11-20",
    jumlah: 2,
    code: `TIK-${id}ABC123`,
    status: "Sudah Dibayar",
  };

  const isPaid = tiket.status === "Sudah Dibayar";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detail Tiket</Text>

      <View style={styles.card}>
        {/* STATUS */}
        <View
          style={[
            styles.statusBadge,
            isPaid ? styles.badgePaid : styles.badgeWaiting,
          ]}
        >
          <Text style={styles.statusText}>{tiket.status}</Text>
        </View>

        {/* KODE */}
        <Text style={styles.code}>{tiket.code}</Text>
        <Text style={styles.subtitle}>Kode Tiket</Text>

        {/* INFO */}
        <View style={styles.infoBox}>
          <InfoRow label="Destinasi" value={tiket.destinasi} />
          <InfoRow label="Nama Pemesan" value={tiket.nama} />
          <InfoRow label="Tanggal Kunjungan" value={tiket.tanggal} />
          <InfoRow label="Jumlah Tiket" value={`${tiket.jumlah} Orang`} />
        </View>

        {/* QR */}
        <View style={styles.qrWrapper}>
          <QRCode value={tiket.code} size={180} />
        </View>

        <Text style={styles.note}>
          Tunjukkan QR Code ini kepada petugas untuk masuk
        </Text>
      </View>
    </ScrollView>
  );
}

/* ================= COMPONENT ================= */
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 90,
    backgroundColor: "#F4F6F8",
    flexGrow: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  badgePaid: {
    backgroundColor: "#DCFCE7",
  },

  badgeWaiting: {
    backgroundColor: "#FEF3C7",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
  },

  code: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },

  infoBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    marginBottom: 20,
    gap: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
    maxWidth: "60%",
  },

  qrWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },

  note: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
  },
});
