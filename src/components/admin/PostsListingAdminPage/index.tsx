import { ErrorMessage } from "@/components/ErrorMessage";
import { findAllPostFromApi } from "@/lib/post/queries/admin";
import clsx from "clsx";
import Link from "next/link";
import { DeletePostButton } from "../DeletePostButton";

export async function PostsListingAdminPage() {
  const postsRes = await findAllPostFromApi();

  if (!postsRes.success) {
    console.log(postsRes.errors);
    return (
      <ErrorMessage contentTitle="Hey!🧚🏻‍♀️" content="Faça login novamente! 🪧" />
    );
  }

  const posts = postsRes.data;

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
