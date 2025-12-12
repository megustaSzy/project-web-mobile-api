import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login/page"); // redirect ke landing
  }, []);

  return null;
}
