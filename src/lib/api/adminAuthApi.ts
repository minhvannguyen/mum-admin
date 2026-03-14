import { User } from "@/types/User";

const BASE_URL = "https://localhost:7114/api/admin/auth";

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include", // quan trọng để nhận cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function me(): Promise<User> {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include", // gửi cookie session
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
}

export async function dashboard() {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Get infomation dashboard failed");
  }

  const json = await res.json()

  return json.data
}