import Link from "next/link";

export function Footer() {
  return (
    <footer className="pb-8 text-center">
      <p className="py-8">
        Copyright <sup>&copy;</sup> {new Date().getFullYear()} -{" "}
        <Link href="/"> myBlog </Link>
      </p>
    </footer>
  );
}
