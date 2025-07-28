import clsx from "clsx";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";
import { findAllPublicPostsFromApi } from "@/lib/post/queries/public";
import { ErrorMessage } from "../ErrorMessage";

export async function FeaturedPost() {
  const postRes = await findAllPublicPostsFromApi();
  const noPostFound = (
    <ErrorMessage
      contentTitle="Atenção!🐣"
      content="Nenhum post foi encontrado"
    />
  );

  if (!postRes.success) {
    return noPostFound;
  }

  const posts = postRes.data;

  if (posts.length <= 0) {
    return noPostFound;
  }

  const post = posts[0];

  const postLink = `/post/${post.slug}`;
  return (
    <section
      className={clsx("grid grid-cols-1 gap-8 mb-10", "sm:grid-cols-2 group")}
    >
      <PostCoverImage
        linkProps={{ href: postLink }}
        imageProps={{
          width: 1200,
          height: 680,
          alt: post.title,
          src: post.coverImageUrl,
          priority: true,
        }}
      />
      <PostSummary
        postLink={postLink}
        postHeading="h1"
        createdAt={post.createdAt}
        excerpt={post.excerpt}
        title={post.title}
      />
    </section>
  );
}
