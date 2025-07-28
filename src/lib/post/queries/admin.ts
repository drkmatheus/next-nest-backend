import { PostModel, PostModelFromApi } from "@/models/post/postModel";
import { postRepository } from "@/repositories/post";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { cache } from "react";

export const findPostById = cache(async (id: string) => {
  return await postRepository.findById(id);
});

export const findPostByIdFromApi = cache(async (id: string) => {
  const postResponse = await authenticatedApiRequest<PostModelFromApi>(
    `/post/me/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  return postResponse;
});

export const findAllPosts = cache(async () => {
  return await postRepository.findAll();
});

export const findAllPostFromApi = cache(async () => {
  const postResponse = await authenticatedApiRequest<PostModelFromApi[]>(
    `/post/me`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  return postResponse;
});
