import clsx from "clsx";
import Link from "next/link";

type PostHeadingProps = {
  children: React.ReactNode;
  url: string;
  as?: "h1" | "h2";
};

export function PostHeading({
  children,
  url,
  as: Tag = "h2",
}: PostHeadingProps) {
  // Veja só o nivel de manipulação de granularidade que é possivel fazer:

  const headingClassesMap = {
    h1: "text-3xl/tight block mb-2 sm:text-4xl",
    h2: "text-2xl/tight block mb-2 sm:text-3xl",
  };

  const commonClasses = "font-bold";

  return (
    <Tag className={clsx(headingClassesMap[Tag], commonClasses)}>
      <Link className="hover:text-blue-500 transition" href={url}>
        {children}
      </Link>
    </Tag>
  );
}
