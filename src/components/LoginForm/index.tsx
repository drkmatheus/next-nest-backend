"use client";
import { loginAction } from "@/actions/login/login-action";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import clsx from "clsx";
import { LoaderPinwheelIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { HoneypotInput } from "../HoneypotInput";

export function LoginForm() {
  const initialState = {
    email: "",
    errors: [],
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userChanged = searchParams.get("userChanged");
  const created = searchParams.get("created");

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach((e) => toast.error(e));
    }
  }, [state]);

  useEffect(() => {
    if (userChanged === "1") {
      toast.dismiss();
      toast.success("Seu usuário foi modificado. Faça login novamente.");
      const url = new URL(window.location.href);
      url.searchParams.delete("userChanged");
      router.replace(url.toString());
    }

    if (created === "1") {
      toast.dismiss();
      toast.success("Usuário criado.");
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.toString());
    }
  }, [userChanged, created, router]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "text-center max-w-sm mx-auto mt-16 mb-32"
      )}
    >
      <form action={action} className="flex flex-col flex-1 gap-5">
        <InputText
          type="email"
          name="email"
          labelText="Email"
          placeholder="Seu email"
          required
          disabled={isPending}
          defaultValue={state.email}
        />
        <InputText
          type="password"
          name="password"
          labelText="Senha"
          placeholder="Sua senha"
          required
          disabled={isPending}
        />

        <HoneypotInput />

        <Button type="submit" className="mt-4" disabled={isPending}>
          {!isPending ? (
            <LogInIcon />
          ) : (
            <LoaderPinwheelIcon className="animate-spin" />
          )}
          Entrar
        </Button>

        <p className="text-sm/tight hover:underline">
          <Link href="user/new">
            Não possui uma conta? Clique aqui para criar uma
          </Link>
        </p>
      </form>
    </div>
  );
}
