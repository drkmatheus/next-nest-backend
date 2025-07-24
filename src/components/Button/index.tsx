import clsx from "clsx";

type ButtonVariants = "default" | "ghost" | "danger";
type ButtonSizes = "sm" | "md" | "lg";
type ButtonProps = {
  variant?: ButtonVariants;
  size?: ButtonSizes;
} & React.ComponentProps<"button">;

export function Button({
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const buttonVariants: Record<ButtonVariants, string> = {
    default: clsx(
      "border-blue-700",
      "text-white",
      "bg-blue-500",
      "hover:bg-sky-500"
    ),
    ghost: clsx(
      "bg-slate-300",
      "transition",
      "hover:bg-slate-400",
      "text-slate-950"
    ),
    danger: clsx(
      "bg-red-300",
      "transition",
      "hover:bg-red-500",
      "text-slate-950"
    ),
  };

  const buttonSizes: Record<ButtonSizes, string> = {
    sm: clsx("text-xs/tight rounded-sm py-1 px-2 gap-1"),
    md: clsx("text-md/tight rounded-md py-2 px-4 gap-2"),
    lg: clsx("text-lg/tight rounded-lg py-4 px-6 gap-3"),
  };

  const buttonClass = clsx(
    buttonVariants[variant],
    buttonSizes[size],
    "flex items-center justify-center cursor-pointer transition",
    "disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed",
    props.className
  );

  return <button {...props} className={buttonClass} />;
}
