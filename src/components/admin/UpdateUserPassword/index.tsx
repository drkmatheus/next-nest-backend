"use client";

import { updatePasswordAction } from "@/actions/user/update-user-password-action";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import clsx from "clsx";
import { KeySquareIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export function UpdateUserPassword() {
  const [state, action, isPending] = useActionState(updatePasswordAction, {
    errors: [],
    success: false,
  });

  useEffect(() => {
    toast.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach((e) => toast.error(e));
    }

    if (state.success) {
      toast.success("Atualizado com sucesso");
    }
  }, [state]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "text-center max-w-sm mt-16 mb-32 mx-auto"
      )}
    >
      <form action={action} className={clsx("flex flex-1 flex-col gap-6")}>
        <InputText
          type="password"
          name="currentPassword"
          labelText="Senha atual"
          placeholder="Sua senha atual aqui"
          disabled={isPending}
          defaultValue={""}
        />

        <InputText
          type="password"
          name="newPassword"
          labelText="Nova senha"
          placeholder="Sua nova senha aqui"
          disabled={isPending}
          defaultValue={""}
        />

        <InputText
          type="password"
          name="confirmNewPassword"
          labelText="Repita a nova senha"
          placeholder="Repita a nova senha aqui"
          disabled={isPending}
          defaultValue={""}
        />
        <div className={clsx("flex items-center justify-center mt-4")}>
          <Button size="md" disabled={isPending} type="submit">
            <KeySquareIcon />
            Atualizar senha
          </Button>
        </div>
      </form>
    </div>
  );
}
