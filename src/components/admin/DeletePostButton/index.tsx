"use client";
import { deletePostsAction } from "@/actions/post/delete-posts-action";
import { DeletePostModal } from "@/components/DeletePostModal";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

type DeletePostButtonProps = {
  id: string;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  function handleClick() {
    setShowModal(true);
  }

  function handleConfirm() {
    toast.dismiss();
    startTransition(async () => {
      const result = await deletePostsAction(id);
      setShowModal(false);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Post apagado!🗑️");
    });
  }

  return (
    <>
      <button
        className={clsx(
          "p-1.5",
          "border-2",
          "border-blue-700",
          "rounded-[4px]",
          "flex columns-1",
          "bg-white",
          "hover:bg-blue-200",
          "mr-1",
          "cursor-pointer",
          "hover:text-red-500",
          "disabled:text-slate-500 disabled:cursor-not-allowed"
        )}
        aria-label={`Deletar post ${title}`}
        title="Deletar post"
        onClick={handleClick}
        disabled={isPending}
      >
        <Trash2Icon className="mr-1" /> Deletar
      </button>
      {showModal && (
        <DeletePostModal
          isVisible={showModal}
          title="Confirma exclusão do post?"
          description={
            <>
              Caso clique em {<span className="font-bold">'Sim'</span>}, o post
              será excluido. Essa ação não poderá ser revertida. Clique no botão
              {<span className="font-bold"> 'Não'</span>} caso tenha sido um
              engano.
            </>
          }
          buttonText1="Sim"
          buttonText2="Não"
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
          disabled={isPending}
        />
      )}
    </>
  );
}
