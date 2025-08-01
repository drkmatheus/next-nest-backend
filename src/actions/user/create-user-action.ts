"use server";
import {
  CreateUserSchema,
  UserSchema,
  UserSchemaDto,
} from "@/lib/user/schemas";
import { apiRequest } from "@/utils/api-request";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { verifyHoneypotInput } from "@/utils/verify-honeypot-input";
import { redirect } from "next/navigation";

type CreateUserActionState = {
  user: UserSchemaDto;
  errors: string[];
  success: boolean;
};

export async function createUserAction(
  state: CreateUserActionState,
  formData: FormData
): Promise<CreateUserActionState> {
  const isBot = await verifyHoneypotInput(formData, 5000);

  if (isBot) {
    return {
      user: state.user,
      errors: ["Te peguei, bot imundo"],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ["Dados inválidos"],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedForm = CreateUserSchema.safeParse(formObj);

  if (!parsedForm.success) {
    return {
      user: UserSchema.parse(formObj),
      errors: getZodErrorMessages(parsedForm.error.format()),
      success: false,
    };
  }

  const createResponse = await apiRequest<UserSchemaDto>("/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedForm.data),
  });

  if (!createResponse.success) {
    return {
      user: UserSchema.parse(formObj),
      errors: createResponse.errors,
      success: createResponse.success,
    };
  }

  redirect("/login?created=1");
}
