import { UpdateUser } from "@/components/admin/UpdateUser";
import { MyLoader } from "@/components/MyLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "User Admin",
};

export default async function AdminUserPage() {
  return (
    <Suspense fallback={<MyLoader containerClasses="mb-16" />}>
      <UpdateUser />
    </Suspense>
  );
}
