"use server";
import { deleteLoginSession } from "@/lib/login/manage-login";
import { getUserFromApi } from "@/lib/user/api/get-user";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { redirect } from "next/navigation";

type DeleteUserActionState = {
  errors: string[];
  success: boolean;
};

export async function deleteUserAction() {
  const user = await getUserFromApi();

  if (!user) {
    await deleteLoginSession();

    return {
      errors: ["Faça login novamente"],
      success: false,
    };
  }

  const deleteUserRes = await authenticatedApiRequest<DeleteUserActionState>(
    `/user/me`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application:json",
      },
    }
  );

  if (!deleteUserRes.success) {
    return {
      errors: deleteUserRes.errors,
      success: false,
    };
  }

  //   revalidateTag("posts");

  await deleteLoginSession();
  redirect("/");
}
