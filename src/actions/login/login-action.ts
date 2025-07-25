"use server";

import { LoginSchema } from "@/lib/login/schemas";
import {
  CreateUserSchema,
  UserSchema,
  UserSchemaDto,
} from "@/lib/user/schemas";
import { apiRequest } from "@/utils/api-request";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { simulateLag } from "@/utils/simulate-lag";
import { success } from "zod";

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

  await simulateLag(5000); // para atrasar ataques de força bruta

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

  const loginResponse = await apiRequest<{ accessToken: string }>(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedForm.data),
    }
  );

  if (!loginResponse.success) {
    return {
      email: formEmail,
      errors: loginResponse.errors,
    };
  }

  console.log(loginResponse.data);

  // await createLoginSession(email);
  // redirect("/admin/post");

  return {
    email: formEmail,
    errors: ["Success"],
  };
}
