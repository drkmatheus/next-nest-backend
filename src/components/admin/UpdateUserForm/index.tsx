"use client";
import { Button } from "@/components/Button";
import { DeletePostModal } from "@/components/DeletePostModal";
import { InputText } from "@/components/InputText";
import { simulateLag } from "@/utils/simulate-lag";
import clsx from "clsx";
import { LockKeyholeIcon, RefreshCcwDotIcon, XSquareIcon } from "lucide-react";
import Link from "next/link";
import { startTransition, useState, useTransition } from "react";

export function UpdateUserForm() {
  const [isModalVisible, setIsVisible] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  const safetyDelay = 10000;
  const isElementDisabled = isTransitioning;

  function showDeleteAccountModal(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    setIsVisible(true);

    startTransition(async () => {
      await simulateLag(safetyDelay);
    });
  }

  function handleDeleteUser() {}
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "text-center max-w-sm mt-16 mb-32 mx-auto"
      )}
    >
      <form action="" className="flex flex-col flex-1 gap-6">
        <InputText
          labelText="Nome"
          type="text"
          name="name"
          placeholder="Seu nome"
          disabled={isElementDisabled}
          defaultValue={""}
        />
        <InputText
          labelText="E-mail"
          type="email"
          name="email"
          placeholder="Seu email"
          disabled={isElementDisabled}
          defaultValue={""}
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
