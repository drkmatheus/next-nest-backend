"use client";
import { deleteUserAction } from "@/actions/user/delete-user-action";
import { updateUserAction } from "@/actions/user/update-user-action";
import { Button } from "@/components/Button";
import { DeletePostModal } from "@/components/DeletePostModal";
import { InputText } from "@/components/InputText";
import { UserSchemaDto } from "@/lib/user/schemas";
import { simulateLag } from "@/utils/simulate-lag";
import clsx from "clsx";
import { LockKeyholeIcon, RefreshCcwDotIcon, XSquareIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

type UpdateUserFormProps = {
  user: UserSchemaDto;
};

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const [state, action, isPending] = useActionState(updateUserAction, {
    user,
    errors: [],
    success: false,
  });
  const [isModalVisible, setIsVisible] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  const safetyDelay = 10000;
  const isElementDisabled = isTransitioning || isPending;

  function showDeleteAccountModal(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    setIsVisible(true);

    startTransition(async () => {
      await simulateLag(safetyDelay);
    });
  }

  function handleDeleteUser() {
    startTransition(async () => {
      if (!confirm("Confirme mais uma vez")) {
        return;
      }
      const result = await deleteUserAction();

      if (result.errors) {
        toast.dismiss();
        result.errors.forEach((e) => toast.error(e));
      }

      setIsVisible(false);
    });
  }

  useEffect(() => {
    toast.dismiss();
    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
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
      <form action={action} className="flex flex-col flex-1 gap-6">
        <InputText
          labelText="Nome"
          type="text"
          name="name"
          placeholder="Seu nome"
          disabled={isElementDisabled}
          defaultValue={state.user.name}
        />
        <InputText
          labelText="E-mail"
          type="email"
          name="email"
          placeholder="Seu email"
          disabled={isElementDisabled}
          defaultValue={state.user.email}
        />
        <Button>
          {" "}
          <RefreshCcwDotIcon /> Atualizar
        </Button>
        <div className="flex gap-5 items-center justify-between mt-8">
          <Link
            href={"/admin/user/password"}
            className={clsx(
              "flex gap-2 items-center justify-center transition",
              "hover:text-blue-600"
            )}
          >
            <LockKeyholeIcon /> Trocar senha
          </Link>
          <Link
            href={""}
            onClick={showDeleteAccountModal}
            className={clsx(
              "flex gap-2 items-center justify-center transition",
              "text-red-300 hover:text-red-500"
            )}
          >
            <XSquareIcon />
            Apagar conta
          </Link>
        </div>
      </form>

      <DeletePostModal
        description={
          <>
            Ao apagar meu usuário, meus dados e todos os meus posts também serão
            excluídos. Essa ação é IRREVERSÍVEL. Em alguns segundos os botões
            serão liberados. Clique em <b>OK</b> para confirmar ou{" "}
            <b>Cancelar</b> para fechar essa janela.
          </>
        }
        disabled={isElementDisabled}
        onCancel={() => setIsVisible(false)}
        onConfirm={handleDeleteUser}
        isVisible={isModalVisible}
        title="Apagar meu usuário"
        buttonText1="OK"
        buttonText2="Cancelar"
      />
    </div>
  );
}
