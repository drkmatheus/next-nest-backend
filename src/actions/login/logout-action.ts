"use server";

import { deleteLoginSession } from "@/lib/login/manage-login";
import { simulateLag } from "@/utils/simulate-lag";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await deleteLoginSession();
  redirect("/");
}
