import { LoginForm } from "@/components/LoginForm";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  const metadata: Metadata = {
    title: "Login",
  };

  if (!allowLogin) {
    return (
      <ErrorMessage
        contentTitle="403 🧚🏻‍♀️"
        content="Libere a funcionalidade de login no sistema"
      />
    );
  }

  return <LoginForm />;
}
