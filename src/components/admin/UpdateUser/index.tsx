import { ErrorMessage } from "@/components/ErrorMessage";
import { getUserFromApi } from "@/lib/user/api/get-user";
import { UpdateUserForm } from "../UpdateUserForm";

export async function UpdateUser() {
  const user = await getUserFromApi();

  if (!user) {
    return (
      <ErrorMessage
        pageTitle="Aviso! ⚠️"
        content="Você precisa fazer login novamente"
        contentTitle="Aviso! ⚠️"
      />
    );
  }

  return <UpdateUserForm user={user} />;
}
