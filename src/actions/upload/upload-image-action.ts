"use server";

import { checkLoginSession } from "@/lib/login/manage-login";
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

  const isAuthenticated = await checkLoginSession();

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

  const fileExtension = extname(file.name);
  const uniqueImageName = `${Date.now()}${fileExtension}`;

  const uploadDir = process.env.IMG_UPLOAD_DIR || "uploads";
  const uploadFolderPath = resolve(process.cwd(), "public", uploadDir);
  await mkdir(uploadFolderPath, { recursive: true });

  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);

  const fullPath = resolve(uploadFolderPath, uniqueImageName);

  writeFile(fullPath, buffer);

  const imgServerUrl =
    process.env.IMG_SERVER_URL || "http://localhost:3000/uploads";
  const url = `${imgServerUrl}/${uniqueImageName}`;

  return result({ url });
}
