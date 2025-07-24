import { JsonPostRepository } from "@/repositories/post/json-post-repository";
import { PostRepository } from "./post-repository";
import { DrizzlePostRepository } from "@/repositories/post/drizzle-post-repository";

export const postRepository: PostRepository = new DrizzlePostRepository();
