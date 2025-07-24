import { PostsListingAdminPage } from "@/components/admin/PostsListingAdminPage";
import { MyLoader } from "@/components/MyLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const metadata: Metadata = {
  title: "Admin Page",
};

export default async function AdminPostPage() {
  return (
    <Suspense fallback={<MyLoader />}>
      <PostsListingAdminPage />
    </Suspense>
  );
}
