import { postRepository } from "@/repositories/post";
import { cache } from "react";

export const findPostById = cache(async (id: string) => {
  return await postRepository.findById(id);
});

export const findAllPosts = cache(async () => {
  return await postRepository.findAll();
});
