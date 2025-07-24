"use client";

import dynamic from "next/dynamic";
import { useId } from "react";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorFieldProps = {
  labelText?: string;
  value: string;
  textAreaName: string;
  disabled?: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};
export function MarkdownEditorField({
  labelText = "",
  value,
  textAreaName,
  disabled = false,
  setValue,
}: MarkdownEditorFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      {labelText && (
        <label htmlFor={id} className="text-sm">
          {labelText}
        </label>
      )}
      <div data-color-mode="light">
        <MDEditor
          // É muito importante sanitizar os conteudos que são digitados aqui, para evitar ataques XSS
          // Por isso a area de preview do que voce está digtando está desativada
          className="whitespace-pre-wrap"
          value={value}
          onChange={(value) => {
            if (value === undefined) return;
            setValue(value);
          }}
          height={400}
          extraCommands={[]} // área de preview desativada
          preview="edit"
          hideToolbar={disabled}
          textareaProps={{
            id,
            name: textAreaName,
            disabled: disabled,
          }}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
            remarkPlugins: [[remarkGfm]],
          }}
        />
      </div>
    </div>
  );
}
