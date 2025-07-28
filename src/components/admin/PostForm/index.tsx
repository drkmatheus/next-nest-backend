"use client";
import { Button } from "@/components/Button";
import { InputCheckbox } from "@/components/InputCheckbox";
import { InputText } from "@/components/InputText";
import { MarkdownEditorField } from "@/components/MarkdownEditorField";
import { useActionState, useEffect, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { createPostAction } from "@/actions/post/create-post-action";
import { toast } from "react-toastify";
import { updatePostAction } from "@/actions/post/update-post-action";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PublishedPostForApiDto,
  PublishedPostForApiSchema,
} from "@/lib/post/schemas";

type PostFormCreateProps = {
  mode: "create";
};

type PostFormUpdateProps = {
  mode: "update";
  postDTO: PublishedPostForApiDto;
};

type PostFormProps = PostFormUpdateProps | PostFormCreateProps;

export function PostForm(props: PostFormProps) {
  const { mode } = props;
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const router = useRouter();

  let postDto;
  if (mode === "update") {
    postDto = props.postDTO;
  }

  const actionsMap = {
    update: updatePostAction,
    create: createPostAction,
  };

  const initialState = {
    formState: PublishedPostForApiSchema.parse(postDto || {}),
    errors: [],
  };

  const [state, action, isPending] = useActionState(
    actionsMap[mode],
    initialState
  );

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach((error) => toast.error(error));
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.success) {
      toast.dismiss();
      toast.success("Post atualizado");
    }
  }, [state.success]);

  useEffect(() => {
    if (created === "1") {
      toast.dismiss();
      toast.success("Post criado");
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.toString());
    }
  }, [created, router]);

  const { formState } = state;
  const [contentValue, setContentValue] = useState(postDto?.content || "");

  return (
    <form action={action} className="mb-16">
      <div className="flex flex-col gap-3">
        <InputText
          labelText="ID"
          name="id"
          type="text"
          placeholder="ID gerado"
          readOnly
          disabled={isPending}
          defaultValue={formState.id}
        />
        <InputText
          labelText="Slug"
          name="Slug"
          type="text"
          placeholder="Slug gerado"
          readOnly
          disabled={isPending}
          defaultValue={formState.slug}
        />

        <InputText
          labelText="Título"
          name="title"
          type="text"
          placeholder="Digite o título"
          disabled={isPending}
          defaultValue={formState.title}
        />
        <InputText
          labelText="Excerto"
          name="excerpt"
          type="text"
          placeholder="Digite o excerto"
          disabled={isPending}
          defaultValue={formState.excerpt}
        />
        <MarkdownEditorField
          labelText="Conteúdo"
          disabled={isPending}
          value={contentValue}
          setValue={setContentValue}
          textAreaName="content"
        />
        <ImageUploader disabled={isPending} />

        <InputText
          labelText="URL da imagem de capa"
          name="coverImageUrl"
          type="text"
          placeholder="Digite a URL da imagem de capa"
          disabled={isPending}
          defaultValue={formState.coverImageUrl}
        />
        {mode === "update" && (
          <InputCheckbox
            labeltext="Publicar?"
            name="published"
            type="checkbox"
            disabled={isPending}
            defaultChecked={formState.published || false}
          />
        )}
      </div>
      <div className="mt-4">
        <Button disabled={isPending} type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}
