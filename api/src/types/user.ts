export interface UserData {
  name: string;
  email: string;
  password?: string; // opsional saat update
  notelp: string;
  role: "Admin" | "User";
}