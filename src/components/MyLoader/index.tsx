import clsx from "clsx";

type MyLoaderProps = {
  containerClasses?: string;
};

export function MyLoader({ containerClasses = "" }: MyLoaderProps) {
  return (
    <div
      className={clsx(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        containerClasses
      )}
    >
      <div
        className={clsx(
          "w-10 h-10",
          "border-5 border-t-transparent border-blue-500 rounded-full animate-spin",
          "mb-4"
        )}
      ></div>
      <span className="text-center">Carregando...</span>
    </div>
  );
}
