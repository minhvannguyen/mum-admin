import { redirect } from "next/navigation";

export default function Home() {

  const isLogin = false; // check token

  if (!isLogin) {
    redirect("/auth/login");
  }

  redirect("/admin/dashboard");
}