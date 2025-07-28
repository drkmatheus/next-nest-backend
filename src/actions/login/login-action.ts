"use server";

import { createLoginSessionFromApi } from "@/lib/login/manage-login";
import { LoginSchema } from "@/lib/login/schemas";
import { apiRequest } from "@/utils/api-request";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { verifyHoneypotInput } from "@/utils/verify-honeypot-input";
import { redirect } from "next/navigation";

type LoginActionState = {
  email: string;
  errors: string[];
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return {
      email: "",
      errors: ["Login está desativado"],
    };
  }

  const isBot = await verifyHoneypotInput(formData, 5000);

  if (isBot) {
    return {
      email: "",
      errors: ["Te peguei, bot imundo"],
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      email: "",
      errors: ["Dados inválidos"],
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const formEmail = formObj?.email?.toString() || "";
  const parsedForm = LoginSchema.safeParse(formObj);

  if (!parsedForm.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(parsedForm.error.format()),
    };
  }

  const loginResponse = await apiRequest<{ signJwt: string }>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedForm.data),
  });

  if (!loginResponse.success) {
    return {
      email: formEmail,
      errors: loginResponse.errors,
    };
  }

  console.log(loginResponse.data);

  await createLoginSessionFromApi(loginResponse.data.signJwt);
  console.log(
    "Resposta completa da API:",
    JSON.stringify(loginResponse, null, 2)
  );

  redirect("/admin/post");
  // return {
  //   email: formEmail,
  //   errors: [],
  // };
}
