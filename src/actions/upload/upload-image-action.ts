"use server";

import { getLoginSessionFromApi } from "@/lib/login/manage-login";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData
): Promise<UploadImageActionResult> {
  // tomar muito cuidado com os dados que são colocados aqui
  // não fazer funções helpers e calculos aqui

  const result = ({ url = "", error = "" }) => {
    return { url, error };
  };

  const isAuthenticated = await getLoginSessionFromApi();

  if (!isAuthenticated) {
    return result({ error: "Faça login novamente" });
  }

  if (!(formData instanceof FormData)) {
    return result({ error: "Dados inválidos" });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return result({ error: "Arquivo inválido" });
  }

  const maxSizeUpload = Number(process.env.NEXT_PUBLIC_MAX_IMG_SIZE || 921600);

  if (file.size > maxSizeUpload) {
    return result({ error: "Arquivo com tamanho inválido" });
  }

  if (!file.type.startsWith("image/")) {
    return result({ error: "Arquivo inválido" });
  }

  const uploadRes = await authenticatedApiRequest<{ url: string }>(`/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.success) {
    return result({ error: uploadRes.errors[0] });
  }

  const url = `${process.env.IMG_SERVER_URL}${uploadRes.data.url}`;

  return result({ url });
}
