"use server";

import { deleteLoginSession } from "@/lib/login/manage-login";
import { getUserFromApi } from "@/lib/user/api/get-user";
import { UpdatePasswordSchema } from "@/lib/user/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { redirect } from "next/navigation";

type UpdatePasswordActionState = {
  errors: string[];
  success: boolean;
};

export async function updatePasswordAction(
  state: UpdatePasswordActionState,
  formData: FormData
): Promise<UpdatePasswordActionState> {
  const user = await getUserFromApi();

  if (!user) {
    await deleteLoginSession();
    return {
      errors: ["Logue novamente"],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      errors: ["Dados inválidos"],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedFormData = UpdatePasswordSchema.safeParse(formObj);

  console.log(formObj);

  if (!parsedFormData.success) {
    return {
      errors: getZodErrorMessages(parsedFormData.error.format()),
      success: false,
    };
  }

  const updatePasswordRes = await authenticatedApiRequest(`/user/me/password`, {
    method: "PATCH",
    body: JSON.stringify(parsedFormData.data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!updatePasswordRes.success) {
    return {
      errors: updatePasswordRes.errors,
      success: false,
    };
  }

  await deleteLoginSession();
  redirect("/login?userChanged=1");
}
