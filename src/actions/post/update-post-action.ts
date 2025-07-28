"use server";

import { getLoginSessionFromApi } from "@/lib/login/manage-login";
import {
  PostUpdateSchema,
  PublishedPostForApiDto,
  PublishedPostForApiSchema,
  UpdatePostForApiSchema,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { makeRandomString } from "@/utils/make-random-string";
import { revalidateTag } from "next/cache";

type UpdatePostActionState = {
  formState: PublishedPostForApiDto;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData
): Promise<UpdatePostActionState> {
  const isAuthenticated = await getLoginSessionFromApi();

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
  const zodParsedObj = UpdatePostForApiSchema.safeParse(convertFormToObj);

  if (!isAuthenticated) {
    return {
      formState: PublishedPostForApiSchema.parse(convertFormToObj),
      errors: ["Faça login em outra aba para poder salvar o formulário"],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format());
    return {
      formState: PublishedPostForApiSchema.parse(convertFormToObj),
      errors,
    };
  }

  const newPost = zodParsedObj.data;

  const updatePostRes = await authenticatedApiRequest<PublishedPostForApiDto>(
    `/post/me/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!updatePostRes.success) {
    return {
      formState: PublishedPostForApiSchema.parse(convertFormToObj),
      errors: updatePostRes.errors,
    };
  }

  const post = updatePostRes.data;
  revalidateTag("posts");
  revalidateTag(`post-${post.slug}`);

  return {
    formState: PublishedPostForApiSchema.parse(post),
    errors: [],
    success: makeRandomString(),
  };
}
