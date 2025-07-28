"use server";

import { partialPostDTO, PostDto } from "@/dto/post/postdto";
import {
  checkLoginSession,
  getLoginSessionFromApi,
} from "@/lib/login/manage-login";
import {
  CreatePostForApiSchema,
  PostCreateSchema,
  PublishedPostForApiDto,
  PublishedPostForApiSchema,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { getZodErrorMessages } from "@/utils/get-zod-errors";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

type CreatePostActionState = {
  formState: PublishedPostForApiDto;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData
): Promise<CreatePostActionState> {
  const isAuthenticated = await getLoginSessionFromApi();

  if (!(formData instanceof FormData))
    return {
      formState: prevState.formState,
      errors: ["Dados inválidos"],
    };

  const convertFormToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = CreatePostForApiSchema.safeParse(convertFormToObj);

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

  const validPost = zodParsedObj.data;

  const createPostResponse =
    await authenticatedApiRequest<PublishedPostForApiDto>(`/post/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validPost),
    });

  if (!createPostResponse.success) {
    return {
      formState: PublishedPostForApiSchema.parse(convertFormToObj),
      errors: createPostResponse.errors,
    };
  }

  const createdPost = createPostResponse.data;

  revalidateTag("posts");
  redirect(`/admin/post/${createdPost.id}?created=1`);
}
