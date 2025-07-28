import { PostForm } from "@/components/admin/PostForm";
import { postDTO } from "@/dto/post/postdto";
import {
  findAllPostFromApi,
  findPostById,
  findPostByIdFromApi,
} from "@/lib/post/queries/admin";
import { PublishedPostForApiSchema } from "@/lib/post/schemas";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminPostIdPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Editar post 📝",
};

export default async function AdminPostIdPage({
  params,
}: AdminPostIdPageProps) {
  const { id } = await params;
  const postFound = await findPostByIdFromApi(id);

  if (!postFound.success) {
    console.log(postFound.errors);
    notFound();
  }

  const post = postFound.data;
  const publishedPost = PublishedPostForApiSchema.parse(post);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Editar post</h1>
      <PostForm mode="update" postDTO={publishedPost} />
    </div>
  );
}
