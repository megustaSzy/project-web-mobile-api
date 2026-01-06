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

  // STATE DATA API
  const [detail, setDetail] = useState<DestinationDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  // =============================
  // FETCH DETAIL DESTINATION
  // =============================
  const fetchDetail = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/destinations/${id}`);
    const json = await res.json();

    if (json.data) {
      setDetail(json.data);
    }

    setLoading(false);
  } catch (error) {
    console.log("DETAIL ERROR:", error);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Data tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        
        {/* HEADER IMAGE dari API */}
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

        {/* CARD CONTENT */}
        <View style={styles.card}>
          <Text style={styles.title}>{detail.name}</Text>
          <Text style={styles.location}>{detail.location}</Text>

          {/* Info Row */}
          {/* <View style={styles.infoRow}>
            <View style={styles.infoBoxLeft}>
              <Text style={styles.infoText}>Kategori: {detail.category?.name}</Text>
            </View>
            <View style={styles.infoBoxRight}>
              <Text style={styles.infoText}>Harga: IDR {detail.price}</Text>
            </View>
          </View> */}

            {/* Deskripsi API */}
            <Text style={styles.subTitle}>Deskripsi</Text>
            <Text style={styles.description}>{detail.description}</Text>

          {/* Include */}
          <Text style={styles.subTitle}>Include</Text>
          <View style={styles.includeRow}>
            {detail.include.map((item, index) => (
              <View key={index} style={styles.includeItem}>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>


          <Text style={styles.subTitle}>Ketentuan</Text>
          <View style={styles.includeRow}>
            {detail.ketentuan.map((item, index) => (
              <View key={index} style={styles.includeItem}>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>


          {/* Perhatian */}
          <Text style={styles.subTitle}>Perhatian</Text>
          <View style={styles.noticeBox}>
            {detail.perhatian.map((item, index) => (
              <Text key={index} style={styles.noticeText}>
                - {item}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BUTTON PESAN */}
      <View style={styles.bottomContainer}>
        {/* HARGA */}
        <Text style={styles.priceText}>
          Harga  IDR {Number(detail.price).toLocaleString("id-ID")},-
        </Text>

        {/* BUTTON PESAN */}
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() =>
            router.push({
              pathname: "../pesan/[id]",
              params: {
                id: detail.id,
                title: detail.name,
                location: detail.location,
                price: detail.price,
                imageUrl: detail.imageUrl,
              },
            })
          }>
          <Text style={styles.orderText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


/* ===================== STYLE (TIDAK DIUBAH) ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  imageWrapper: { width: "100%", height: 270, position: "relative" },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#001B38",
    opacity: 0.72,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },

  title: { fontSize: 22, fontWeight: "bold", color: "#111" },
  location: { fontSize: 14, color: "#6C6C6C", marginBottom: 15 },

  infoRow: { flexDirection: "row", marginBottom: 25 },
  infoBoxLeft: {
    flex: 1,
    padding: 12,
    backgroundColor: "#2F80ED",
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    alignItems: "center",
  },
  infoBoxRight: {
    flex: 1,
    padding: 12,
    backgroundColor: "#2F80ED",
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },
  infoText: { color: "#fff", fontSize: 13 },

  
  includeRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 25, gap: 15 },
  includeItem: { backgroundColor: "#F8F8F8", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, elevation: 1, justifyContent: "center", alignItems: "center" },
  includeText: { fontSize: 12, color: "#333", fontWeight: "600" },
  
subTitle: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 10,
  color: "#111",
},

noticeBox: {
  paddingVertical: 6,
  marginBottom: 20,
},

noticeText: {
  fontSize: 14,
  color: "#333",
  marginBottom: 6,
  lineHeight: 20,
},


  description: { color: "#6C6C6C", lineHeight: 20, marginBottom: 20 },

  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    paddingHorizontal: 20,
  },
  // orderBtn: {
  //   backgroundColor: "#2F80ED",
  //   paddingVertical: 15,
  //   borderRadius: 40,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   paddingHorizontal: 20,
  //   alignItems: "center",
  // },
  // orderText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  orderPrice: { color: "#fff", fontWeight: "bold" },

  priceText: {
  fontSize: 15,
  fontWeight: "400",
  color: "#111",
  marginBottom: 12,
  textAlign: "left",
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
  fontWeight: "bold",
},

});
