"use client";

import { LoaderPinwheelIcon, UserIcon } from "lucide-react";
import { Button } from "../Button";
import { InputText } from "../InputText";
import Link from "next/link";
import clsx from "clsx";
import { useActionState, useEffect } from "react";
import { createUserAction } from "@/actions/user/create-user-action";
import { UserSchema } from "@/lib/user/schemas";
import { toast } from "react-toastify";

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUserAction, {
    user: UserSchema.parse({}),
    errors: [],
    success: false,
  });

  useEffect(() => {
    toast.dismiss();
    if (state.errors.length > 0) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
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
          name="name"
          labelText="Nome"
          placeholder="Digite seu nome"
          defaultValue={state.user.name}
          disabled={isPending}
          required
        />
        <InputText
          type="text"
          name="email"
          labelText="Email"
          placeholder="Digite seu email"
          defaultValue={state.user.email}
          disabled={isPending}
          required
        />
        <InputText
          type="password"
          name="password"
          labelText="Senha"
          placeholder="Digite sua senha"
          disabled={isPending}
          required
        />
        <InputText
          type="password"
          name="password2"
          labelText="Repita sua senha"
          placeholder="Digite sua senha novamente"
          disabled={isPending}
          required
        />
        <Button disabled={isPending} type="submit" className="mt-4">
          {!isPending ? (
            <UserIcon />
          ) : (
            <LoaderPinwheelIcon className="animate-spin" />
          )}
          Criar conta
        </Button>
        <p className="text-sm/tight hover:underline">
          <Link href="/login">Já possui uma conta? Clique aqui para logar</Link>
        </p>
      </form>
    </div>
  );
}
