"use server";

import {
  checkLoginSession,
  getLoginSessionFromApi,
} from "@/lib/login/manage-login";
import { PublishedPostForApiDto } from "@/lib/post/schemas";
import { postRepository } from "@/repositories/post";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { error } from "console";
import { revalidateTag } from "next/cache";

export async function deletePostsAction(id: string) {
  const isAuthenticated = await getLoginSessionFromApi();

  if (!isAuthenticated) {
    return {
      error: "Faça login em outra aba para poder executar esta ação",
    };
  }

  if (!id || typeof id !== "string") {
    return {
      error: "Dados inválidos",
    };
  }

  const postRes = await authenticatedApiRequest<PublishedPostForApiDto>(
    `/post/me/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!postRes.success) {
    return {
      error: "Erro ao encontrar o post",
    };
  }

  const deletePostRes = await authenticatedApiRequest<PublishedPostForApiDto>(
    `/post/me/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!deletePostRes.status) {
    return {
      error: "Erro ao apagar o post",
    };
  }

  revalidateTag("posts");
  revalidateTag(`post-${postRes.data.slug}`);

  return { error: "" };
}
