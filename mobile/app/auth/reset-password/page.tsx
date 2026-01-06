import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

type ApiError = {
  message?: string;
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { sessionToken } = useLocalSearchParams<{ sessionToken: string }>();

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!sessionToken) {
      setErrorMessage("Token reset tidak valid atau sudah kadaluarsa.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrorMessage("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setErrorMessage("");

      const API_BASE = process.env.EXPO_PUBLIC_API_URL;
      if (!API_BASE) {
        setErrorMessage("Service API belum dikonfigurasi.");
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionToken,
            newPassword: data.password,
          }),
        }
      );

      const resData: ApiError = await res.json();

      if (!res.ok) {
        throw new Error(resData.message ?? "Gagal reset password");
      }

      setSuccess(true);

      setTimeout(() => {
        router.replace("../login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Terjadi kesalahan.");
      }
    }
  };

  /* ================= SUCCESS ================= */
  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Ionicons
            name="checkmark-circle"
            size={72}
            color="#16a34a"
            style={{ alignSelf: "center", marginBottom: 12 }}
          />
          <Text style={styles.title}>Password Berhasil Diubah</Text>
          <Text style={styles.subtitle}>
            Mengarahkan ke halaman login...
          </Text>
        </View>
      </View>
    );
  }

  /* ================= FORM ================= */
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Buat password baru untuk akun Anda
        </Text>

        {errorMessage !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* PASSWORD */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password wajib diisi",
            minLength: {
              value: 8,
              message: "Minimal 8 karakter",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password baru"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text style={styles.errorSmall}>
            {errors.password.message}
          </Text>
        )}

        {/* CONFIRM PASSWORD */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: "Konfirmasi password wajib diisi" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Konfirmasi password"
                secureTextEntry={!showConfirmPassword}
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword((v) => !v)
                }
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorSmall}>
            {errors.confirmPassword.message}
          </Text>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Simpan Password Baru
            </Text>
          )}
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
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
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
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
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
  errorSmall: {
    color: "#dc2626",
    fontSize: 12,
    marginBottom: 6,
  },
});
