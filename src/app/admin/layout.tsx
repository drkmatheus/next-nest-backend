import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { requireLoginSessionForApiOrRedirect } from "@/lib/login/manage-login";

type AdminMenuLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminMenuLayout({
  children,
}: Readonly<AdminMenuLayoutProps>) {
  await requireLoginSessionForApiOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
