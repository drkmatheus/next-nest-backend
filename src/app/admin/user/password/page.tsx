import { MyLoader } from "@/components/MyLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Troca de senha",
};

export default async function UserUpdatePasswordPage() {
  return <Suspense fallback={<MyLoader containerClasses="mb-16" />}></Suspense>;
}
