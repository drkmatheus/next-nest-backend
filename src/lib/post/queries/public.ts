import { postRepository } from "@/repositories/post";
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
