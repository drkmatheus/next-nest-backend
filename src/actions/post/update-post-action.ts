"use server";

import { partialPostDTO, postDTO, PostDto } from "@/dto/post/postdto";
import { checkLoginSession } from "@/lib/login/manage-login";
import { PostUpdateSchema } from "@/lib/post/validations";
import { postRepository } from "@/repositories/post";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { makeRandomString } from "@/utils/make-random-string";
import { revalidateTag } from "next/cache";

type UpdatePostActionState = {
  formState: PostDto;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData
): Promise<UpdatePostActionState> {
  const isAuthenticated = await checkLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ["Dados inválidos"],
    };
  }

  const id = formData.get("id")?.toString() || "";

  if (!id || typeof id !== "string") {
    return {
      formState: prevState.formState,
      errors: ["ID inválido"],
    };
  }

  const convertFormToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostUpdateSchema.safeParse(convertFormToObj);

  if (!isAuthenticated) {
    return {
      formState: partialPostDTO(convertFormToObj),
      errors: ["Faça login em outra aba para poder salvar o formulário"],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format());
    return {
      formState: partialPostDTO(convertFormToObj),
      errors,
    };
  }

  const validPost = zodParsedObj.data;
  const newPost = {
    ...validPost,
  };

  let post;
  try {
    post = await postRepository.update(id, newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: partialPostDTO(convertFormToObj),
        errors: [e.message],
      };
    }
    return {
      formState: partialPostDTO(convertFormToObj),
      errors: ["Erro desconhecido"],
    };
  }

  revalidateTag("posts");
  revalidateTag(`post-${post.slug}`);

  return {
    formState: postDTO(post),
    errors: [],
    success: makeRandomString(),
  };
}
