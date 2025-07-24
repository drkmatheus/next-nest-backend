import { PostModel } from "@/models/post/postModel";

export interface PostRepository {
  findAllPublished(): Promise<PostModel[]>;
  findAll(): Promise<PostModel[]>;
  findById(id: string): Promise<PostModel>;
  findBySlug(slug: string): Promise<PostModel>;

  create(post: PostModel): Promise<PostModel>;
  delete(id: string): Promise<PostModel>;
  update(
    id: string,
    newPost: Omit<PostModel, "id" | "slug" | "createdAt" | "updatedAt">
  ): Promise<PostModel>;
}
