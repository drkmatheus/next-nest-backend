import clsx from "clsx";
import { useId } from "react";

type InputCheckboxProps = {
  labeltext?: string;
  type?: "checkbox";
} & React.ComponentProps<"input">;

export function InputCheckbox({
  labeltext = "",
  type = "checkbox",
  ...props
}: InputCheckboxProps) {
  const id = useId();

  return (
    <div className="flex gap-2 items-center">
      <input
        {...props}
        className={clsx(
          "h-4 w-4 outline-none focus:ring-2 focus:ring-sky-500",
          props.className
        )}
        id={id}
        type={type}
      />
      {labeltext && (
        <label className="text-" htmlFor={id}>
          {labeltext}
        </label>
      )}
    </div>
  );
}
