"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setErrorMessage("");

      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        setErrorMessage("API belum dikonfigurasi");
        return;
      }

      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gagal mengirim email reset");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message ?? "Terjadi kesalahan");
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Ionicons
            name="mail-outline"
            size={72}
            color="#2563eb"
            style={{ alignSelf: "center", marginBottom: 12 }}
          />
          <Text style={styles.title}>Email Terkirim</Text>
          <Text style={styles.subtitle}>
            Silakan cek email Anda untuk link reset password
          </Text>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.replace("../login/page")}
          >
            <Text style={styles.outlineButtonText}>Kembali ke Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Lupa Password</Text>
        <Text style={styles.subtitle}>
          Masukkan email untuk menerima link reset password
        </Text>

        {errorMessage !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email wajib diisi",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Format email tidak valid",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Kirim Link Reset
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.replace("../login/page")}
        >
          <Text style={styles.outlineButtonText}>Kembali ke Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 44,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  outlineButtonText: {
    fontWeight: "500",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "center",
  },
});
