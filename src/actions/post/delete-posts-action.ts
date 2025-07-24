"use server";

import { checkLoginSession } from "@/lib/login/manage-login";
import { postRepository } from "@/repositories/post";
import { revalidateTag } from "next/cache";

export async function deletePostsAction(id: string) {
  const isAuthenticated = await checkLoginSession();

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

  let post;

  try {
    post = await postRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return {
      error: "Erro desconhecido",
    };
  }

  revalidateTag("posts");
  revalidateTag(`post-${post.slug}`);

  return { error: "" };
}
