import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const formatRupiah = (value: unknown): string => {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : typeof value === "bigint"
      ? Number(value)
      : 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numericValue);
};

type DestinationDetail = {
  id: number;
  name: string;
  imageUrl: string;
  location: string;
  category: {
    name: string;
  } | null;
  description: string;
  include: string[];
  ketentuan: string[];
  perhatian: string[];
  price: number;
};


export default function DetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [detail, setDetail] = useState<DestinationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/destinations/${id}`);
        const json = await res.json();

        // Sesuaikan jika struktur backend berbeda
        setDetail(json.data ?? json);
      } catch (error) {
        console.error("Gagal mengambil detail destinasi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;
  if (!detail) return <Text>Data tidak ditemukan.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {/* HERO IMAGE */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: detail.imageUrl
                ? API_URL + detail.imageUrl
                : "https://via.placeholder.com/600",
            }}
            style={styles.heroImage}
          />
          <View style={styles.overlay} />
        </View>

        {/* FLOATING CARD */}
        <View style={styles.card}>
          {/* TITLE */}
          <Text style={styles.title}>{detail.name}</Text>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.subText}>
              {detail.category?.name ?? detail.location}
            </Text>
          </View>

          {/* BADGE */}
          <View style={styles.badgeWrapper}>
            <View style={styles.badge}>
              <Ionicons name="people-outline" size={18} color="#fff" />
              <Text style={styles.badgeText}>Max 16 User</Text>
            </View>

            <View style={styles.badge}>
              <Ionicons name="time-outline" size={18} color="#fff" />
              <Text style={styles.badgeText}>12 Hours Duration</Text>
            </View>
          </View>

          {/* INCLUDE */}
          <Text style={styles.sectionTitle}>Include</Text>
          <View style={styles.includeWrapper}>
            {detail.include?.map((item, index) => (
              <View key={index} style={styles.includePill}>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* DESKRIPSI */}
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{detail.description}</Text>

          {/* KETENTUAN */}
          {detail.ketentuan?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ketentuan</Text>
              {detail.ketentuan.map((item, index) => (
                <Text key={index} style={styles.warning}>
                  • {item}
                </Text>
              ))}
            </>
          )}

          {/* PERHATIAN */}
          {detail.perhatian?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Perhatian</Text>
              {detail.perhatian.map((item, index) => (
                <Text key={index} style={styles.warning}>
                  • {item}
                </Text>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM BUTTON */}
      <View style={styles.bottomBar}>
        <Text style={styles.priceLabel}>
          {formatRupiah(detail.price)}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: pressed ? "#E0E0E0" : "#0080FF" },
          ]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => router.push(`/pesan/${detail.id}`)}
        >
          <Text style={styles.buttonText}>Pesan Sekarang</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  heroContainer: {
    width: "100%",
    height: 330,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,27,56,0.72)",
  },

  /* FLOATING CARD */
  card: {
    marginTop: -40,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 22,
    elevation: 7,
  },

  title: { fontSize: 21, fontWeight: "800", color: "#111" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  subText: { marginLeft: 4, color: "#6B7280" },

  badgeWrapper: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },

  badge: {
    backgroundColor: "#001B38",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  badgeText: { color: "#fff", fontSize: 13 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    color: "#111",
  },

  includeWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  includePill: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  includeText: { fontSize: 13, color: "#374151" },

  description: {
    marginTop: 6,
    color: "#4B5563",
    lineHeight: 20,
  },

  warning: {
    marginTop: 4,
    color: "#FF3B30",
    fontSize: 14,
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0080FF",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 14,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
