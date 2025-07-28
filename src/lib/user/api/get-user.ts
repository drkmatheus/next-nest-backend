import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { UserSchema, UserSchemaDto } from "../schemas";

export async function getUserFromApi() {
  const userRes = await authenticatedApiRequest<UserSchemaDto>(`/user/me`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!userRes.success) {
    return undefined;
  }

  return UserSchema.parse(userRes.data);
}
