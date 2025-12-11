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
  tanggal: string; // yyyy-mm-dd
  status: "Sudah Dibayar" | "Menunggu Konfirmasi" | "Dibatalkan";
};

export default function TiketScreen() {
  const navigation: any = useNavigation();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const badgeColor = (status: Ticket["status"]) => {
    if (status === "Sudah Dibayar") return styles.badgeGreen;
    if (status === "Menunggu Konfirmasi") return styles.badgeYellow;
    return styles.badgeRed;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiket Saya</Text>

      {/* SEARCH */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Cari berdasarkan destinasi, kode, atau tanggal..."
        style={styles.search}
      />

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>

        <TouchableOpacity onPress={() => setStatusFilter("all")}>
          <Text style={statusFilter === "all" ? styles.filterActive : styles.filterText}>
            Semua
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setStatusFilter("Sudah Dibayar")}>
          <Text
            style={
              statusFilter === "Sudah Dibayar"
                ? styles.filterActive
                : styles.filterText
            }
          >
            Sudah Dibayar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setStatusFilter("Menunggu Konfirmasi")}>
          <Text
            style={
              statusFilter === "Menunggu Konfirmasi"
                ? styles.filterActive
                : styles.filterText
            }
          >
            Menunggu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setStatusFilter("Dibatalkan")}>
          <Text
            style={
              statusFilter === "Dibatalkan" ? styles.filterActive : styles.filterText
            }
          >
            Dibatalkan
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ color: "#666" }}>Tidak ada tiket yang cocok.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("TiketDetail", { id: item.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.destinasi}>{item.destinasi}</Text>

                <Text style={styles.info}>{formatDate(item.tanggal)}</Text>

                <Text style={styles.kode}>Kode: {item.code}</Text>
              </View>

              <View style={[styles.badge, badgeColor(item.status)]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  search: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterLabel: { color: "#444", marginRight: 4 },
  filterText: { color: "#666" },
  filterActive: { color: "#2563eb", fontWeight: "700" },

  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  destinasi: { fontSize: 16, fontWeight: "600" },
  info: { fontSize: 14, color: "#666", marginTop: 4 },
  kode: { fontSize: 12, color: "#777", marginTop: 4 },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "600" },

  badgeGreen: { backgroundColor: "#d1fae5" },
  badgeYellow: { backgroundColor: "#fef9c3" },
  badgeRed: { backgroundColor: "#fee2e2" },

  emptyBox: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
});
