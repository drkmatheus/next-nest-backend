import { PostForm } from "@/components/admin/PostForm";
import { PencilLineIcon } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type AdminPostIdPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Criar post ✏️",
};

export default async function NewPostPage({ params }: AdminPostIdPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Criar Post</h1>
      <PostForm mode="create" />
    </div>
  );
}
