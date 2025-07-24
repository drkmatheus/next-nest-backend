"use server";

import { checkPassword, createLoginSession } from "@/lib/login/manage-login";
import { simulateLag } from "@/utils/simulate-lag";
import { redirect } from "next/navigation";

type LoginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return {
      username: "",
      error: "Login está desativado",
    };
  }

  await simulateLag(5000); // para atrasar ataques de força bruta

  if (!(formData instanceof FormData)) {
    return {
      username: "",
      error: "Dados inválidos",
    };
  }

  const username = formData.get("username")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";

  if (!username || !password) {
    return {
      username,
      error: "Dados inválidos",
    };
  }

  const usernameExiste = username === process.env.LOGIN_USER;
  const passwordMatch = await checkPassword(
    password,
    process.env.LOGIN_PASS || ""
  );

  if (!usernameExiste || !passwordMatch) {
    return {
      username,
      error: "Usuário ou senha incorretos",
    };
  }

  await createLoginSession(username);
  redirect("/admin/post");
}
