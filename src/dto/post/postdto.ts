import { PostModel } from "@/models/post/postModel";

export type PostDto = Omit<PostModel, "updatedAt">;

export const partialPostDTO = (post?: Partial<PostModel>): PostDto => {
  return {
    id: post?.id || "",
    slug: post?.slug || "",
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    content: post?.content || "",
    coverImageUrl: post?.coverImageUrl || "",
    createdAt: post?.createdAt || "",
    published: post?.published || false,
  };
};

export const postDTO = (post: PostModel): PostDto => {
  return partialPostDTO(post);
};
