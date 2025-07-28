import { findPublicPostsBySlugFromApi } from "@/lib/post/queries/public";
import Image from "next/image";
import { PostHeading } from "../PostHeading";
import { PostFormattedDate } from "../PostFormattedDate";
import clsx from "clsx";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { notFound } from "next/navigation";

type SinglePostProps = {
  slug: string;
};

export async function SinglePost({ slug }: SinglePostProps) {
  const postRes = await findPublicPostsBySlugFromApi(slug);

  if (!postRes.success) {
    notFound();
  }

  const post = postRes.data;

  return (
    <article className="mb-10">
      <header className="flex flex-col gap-3 mb-3">
        <Image
          className="rounded-xl"
          src={post.coverImageUrl}
          width={1020}
          height={720}
          alt={post.title}
        />

        <PostHeading url={`/post/${post.slug}`}>{post.title}</PostHeading>
        <p>
          {post.author.name} | {<PostFormattedDate dateTime={post.createdAt} />}
        </p>
      </header>
      <p className={clsx("text-xl mb-8")}>{post.excerpt}</p>
      <MarkdownRenderer markdown={post.content} />
    </article>
  );
}
