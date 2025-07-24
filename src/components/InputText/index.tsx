import clsx from "clsx";
import { useId } from "react";

type InputTextProps = { labelText?: string } & React.ComponentProps<"input">;

export function InputText({ labelText = "", ...props }: InputTextProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      {labelText && <label htmlFor={id}>{labelText}</label>}
      <input
        className={clsx(
          "bg-white outline-0 text-base/tight",
          "ring-2 ring-slate-400 rounded",
          "p-2 transition focus:ring-sky-400",
          "disabled:bg-slate-200 disabled:cursor-not-allowed",
          "read-only:bg-slate-400",
          props.className
        )}
        {...props}
        id={id}
      />
    </div>
  );
}
