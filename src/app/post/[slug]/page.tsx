import { MyLoader } from "@/components/MyLoader";
import { SinglePost } from "@/components/SinglePost";
import { findPublicPostsBySlugFromApi } from "@/lib/post/queries/public";
import { Metadata } from "next";
import { Suspense } from "react";

type PostSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  const postRes = await findPublicPostsBySlugFromApi(slug);

  if (!postRes.success) {
    return {};
  }

  const post = postRes.data;

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostSlugPage({ params }: PostSlugPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<MyLoader containerClasses="min-h-10 mb-4" />}>
      <SinglePost slug={slug} />
    </Suspense>
  );
}
