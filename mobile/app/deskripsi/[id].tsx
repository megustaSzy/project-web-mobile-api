import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

type DestinationDetailType = {
  id: string | number;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  description: string;
  include: string[];
  ketentuan: string[];
  perhatian: string[];
  category?: {
    name: string;
  };
};

export default function DestinationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const [detail, setDetail] = useState<DestinationDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/destinations/${id}`);
        const json = await res.json();
        setDetail(json.data);
      } catch (err) {
        console.log("DETAIL ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.center}>
        <Text>Data tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* HEADER IMAGE */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: detail.imageUrl.startsWith("http")
                ? detail.imageUrl
                : `${BASE_URL}${detail.imageUrl}`,
            }}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
        </View>

        {/* CARD PUTIH */}
        <View style={styles.card}>
          {/* TITLE */}
          <Text style={styles.title}>{detail.name}</Text>

          {/* CATEGORY (SESUAI YANG DIKLIK) */}
          {detail.category?.name && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {detail.category.name}
              </Text>
            </View>
          )}

          {/* LOCATION */}
          <Text style={styles.location}>{detail.location}</Text>

          {/* DESKRIPSI */}
          <Text style={styles.subTitle}>Deskripsi</Text>
          <Text style={styles.description}>{detail.description}</Text>

          {/* INCLUDE */}
          <Text style={styles.subTitle}>Include</Text>
          <View style={styles.includeRow}>
            {detail.include.map((item, index) => (
              <View key={index} style={styles.includeItem}>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* KETENTUAN */}
          <Text style={styles.subTitle}>Ketentuan</Text>
          <View style={styles.includeRow}>
            {detail.ketentuan.map((item, index) => (
              <View key={index} style={styles.includeItem}>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* PERHATIAN */}
          <Text style={styles.subTitle}>Perhatian</Text>
          <View style={styles.noticeBox}>
            {detail.perhatian.map((item, index) => (
              <Text key={index} style={styles.noticeText}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM ACTION */}
      <View style={styles.bottomContainer}>
        <Text style={styles.priceText}>
          Harga IDR {Number(detail.price).toLocaleString("id-ID")}
        </Text>

        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() =>
            router.push({
              pathname: "../pesan/[id]",
              params: {
                id: detail.id,
                title: detail.name,
                category: detail.category?.name, // ← kirim kategori juga
                location: detail.location,
                price: detail.price,
                imageUrl: detail.imageUrl,
              },
            })
          }
        >
          <Text style={styles.orderText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  imageWrapper: { height: 270 },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#001B38",
    opacity: 0.7,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 10,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F80ED",
    textTransform: "capitalize",
  },

  location: {
    fontSize: 14,
    color: "#6C6C6C",
    marginBottom: 15,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },

  description: {
    color: "#6C6C6C",
    lineHeight: 20,
    marginBottom: 20,
  },

  includeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  includeItem: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  includeText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },

  noticeBox: { marginBottom: 20 },
  noticeText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    paddingHorizontal: 20,
  },

  priceText: {
    fontSize: 15,
    color: "#111",
    marginBottom: 12,
  },

  orderBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 15,
    borderRadius: 40,
    alignItems: "center",
  },

  orderText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
