import { hashPassword } from "@/lib/login/manage-login";

(async () => {
  const rawPass = "";
  const hashedPass = await hashPassword(rawPass);

  console.log({ hashedPass });
})();
