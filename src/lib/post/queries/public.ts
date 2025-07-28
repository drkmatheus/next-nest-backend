import { PostModelFromApi } from "@/models/post/postModel";
import { postRepository } from "@/repositories/post";
import { apiRequest } from "@/utils/api-request";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

export const findAllPublicPosts = cache(
  unstable_cache(
    async () => {
      return await postRepository.findAllPublished();
    },
    ["posts"],
    { tags: ["posts"] }
  )
);

export const findAllPublicPostsFromApi = cache(async () => {
  const postsRes = await apiRequest<PostModelFromApi[]>(`/post`, {
    next: {
      tags: ["posts"],
      revalidate: 86400,
    },
  });
  return postsRes;
});

export const findPostBySlug = cache((slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const post = await postRepository.findBySlug(slug).catch(() => undefined);

      if (!post) notFound();

      return post;
    },
    ["posts"],
    {
      tags: [`post-${slug}`],
    }
  )(slug);
});

export const findPublicPostsBySlugFromApi = cache(async (slug: string) => {
  const postsRes = await apiRequest<PostModelFromApi>(`/post/${slug}`, {
    next: {
      tags: [`post-${slug}`],
      revalidate: 86400,
    },
  });
  return postsRes;
});
