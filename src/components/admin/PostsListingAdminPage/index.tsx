import { ErrorMessage } from "@/components/ErrorMessage";
import { findAllPosts } from "@/lib/post/queries/admin";
import clsx from "clsx";
import Link from "next/link";
import { DeletePostButton } from "../DeletePostButton";

export async function PostsListingAdminPage() {
  const posts = await findAllPosts();

  if (posts.length <= 0) {
    return (
      <ErrorMessage
        contentTitle="Hey!🧚🏻‍♀️"
        content="Nenhum post foi criado ainda! 🪧"
      />
    );
  }

  return (
    <div className="text-1xl text-center">
      {posts.map((post) => {
        return (
          <div
            className={clsx(
              "py-2",
              !post.published && "bg-slate-300",
              "flex gap-2 items-center justify-between"
            )}
            key={post.id}
          >
            <Link href={`/admin/post/${post.id}`}>{post.title}</Link>

            <DeletePostButton id={post.id} title={post.title} />
          </div>
        );
      })}
    </div>
  );
}
