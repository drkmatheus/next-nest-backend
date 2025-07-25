"use client";
import { loginAction } from "@/actions/login/login-action";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import clsx from "clsx";
import { LoaderPinwheelIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export function LoginForm() {
  const initialState = {
    email: "",
    errors: [],
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach((e) => toast.error(e));
    }
  }, [state]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "text-center max-w-sm mx-auto mt-16 mb-32"
      )}
    >
      <form action={action} className="flex flex-col flex-1 gap-5">
        <InputText
          type="text"
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
