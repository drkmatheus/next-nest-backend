import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { requireLoginOrRedirect } from "@/lib/login/manage-login";

type AdminMenuLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminMenuLayout({
  children,
}: Readonly<AdminMenuLayoutProps>) {
  await requireLoginOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
