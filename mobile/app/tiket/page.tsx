import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type Ticket = {
  id: number;
  code: string;
  destinasi: string;
  tanggal: string;
  status: "Sudah Dibayar" | "Menunggu Konfirmasi" | "Dibatalkan";
};

export default function TiketScreen() {
  const navigation: any = useNavigation();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Ticket["status"]>(
    "all"
  );

  const [tickets] = useState<Ticket[]>([
    {
      id: 1,
      code: "TIK-20231101",
      destinasi: "Pantai Sari Ringgung",
      tanggal: "2025-11-20",
      status: "Sudah Dibayar",
    },
    {
      id: 2,
      code: "TIK-20231102",
      destinasi: "Puncak Mas",
      tanggal: "2025-12-01",
      status: "Menunggu Konfirmasi",
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tickets
      .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
      .filter(
        (t) =>
          !q ||
          t.destinasi.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.tanggal.includes(q)
      )
      .sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      );
  }, [tickets, query, statusFilter]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const badgeStyle = (status: Ticket["status"]) => {
    switch (status) {
      case "Sudah Dibayar":
        return styles.badgeGreen;
      case "Menunggu Konfirmasi":
        return styles.badgeYellow;
      default:
        return styles.badgeRed;
    }
  };

  const FilterChip = ({ label }: { label: "all" | Ticket["status"] }) => (
    <TouchableOpacity
      onPress={() => setStatusFilter(label)}
      style={[
        styles.chip,
        statusFilter === label && styles.chipActive,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          statusFilter === label && styles.chipTextActive,
        ]}
      >
        {label === "all" ? "Semua" : label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiket Saya</Text>

      {/* SEARCH */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Cari destinasi, kode, atau tanggal"
        style={styles.search}
      />

      {/* FILTER */}
      <View style={styles.filterRow}>
        <FilterChip label="all" />
        <FilterChip label="Sudah Dibayar" />
        <FilterChip label="Menunggu Konfirmasi" />
        <FilterChip label="Dibatalkan" />
      </View>

      {/* LIST */}
      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Tidak ada tiket ditemukan</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("TiketDetail", { id: item.id })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.destinasi}>{item.destinasi}</Text>
                <Text style={styles.info}>{formatDate(item.tanggal)}</Text>
                <Text style={styles.kode}>Kode • {item.code}</Text>
              </View>

              <View style={[styles.badge, badgeStyle(item.status)]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
    paddingTop: 90,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111",
  },

  search: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
  },

  chipActive: {
    backgroundColor: "#2563EB",
  },

  chipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
    elevation: 2,
  },

  destinasi: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  info: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  kode: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "center",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  badgeGreen: { backgroundColor: "#D1FAE5", color: "#065F46" },
  badgeYellow: { backgroundColor: "#FEF3C7", color: "#92400E" },
  badgeRed: { backgroundColor: "#FEE2E2", color: "#991B1B" },

  emptyBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
  },
});
