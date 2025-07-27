import { getLoginSessionFromApi } from "@/lib/login/manage-login";
import { redirect } from "next/navigation";
import { ApiRequest, apiRequest } from "./api-request";

export async function authenticatedApiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<ApiRequest<T>> {
  if (typeof window !== "undefined") {
    throw new Error("Essa função só pode ser usada no lado do servidor");
  }

  const jwtToken = await getLoginSessionFromApi();

  if (!jwtToken) {
    // redirect("/login");

    return {
      success: false,
      errors: ["Usuario não autenticado"],
      status: 401,
    };
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${jwtToken}`,
  };

  return apiRequest<T>(path, { ...options, headers });
}
