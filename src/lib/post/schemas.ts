import { isUrlOrRelativePath } from "@/utils/is-url-or-relative-path";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { UserSchema } from "../user/schemas";

// aqui é passado o formato do objeto pro zod validar
const PostBaseSchema = z.object({
  // em cada chave tá as validações que eu quero em cada campo
  title: z
    .string()
    .trim()
    .min(3, "Título deve ter, no mínimo, 3 caracteres")
    .max(120, "Título deve ter no máximo 120 caracteres"),
  content: z
    .string()
    .trim()
    .min(3, "Conteúdo é obrigatório")
    .transform((val) => sanitizeHtml(val)),
  author: z
    .string()
    .trim()
    .min(4, "Autor precisa de no mínimo 4 caracteres")
    .max(100, "Nome do autor não deve ter mais que 100 caracteres"),
  excerpt: z
    .string()
    .trim()
    .min(3, "Excerto precisa de no mínimo 3 caracteres")
    .max(200, "Excerto não deve ter mais que 200 caracteres"),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: "URL da capa deve ser uma URL ou caminho para imagem",
  }),
  published: z
    .union([
      z.literal("on"),
      z.literal("true"),
      z.literal("false"),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform((val) => val === "on" || val === "true" || val === true),
});

// PostCreateSchema: igual ao base por enquanto
export const PostCreateSchema = PostBaseSchema;

// PostUpdateSchema: pode incluir campos extras no futuro (ex: id)
export const PostUpdateSchema = PostBaseSchema.extend({
  // id: z.string().uuid('ID inválido'),
});

export const CreatePostForApiSchema = PostBaseSchema.omit({
  author: true,
  published: true,
}).extend({});

export const UpdatePostForApiSchema = PostBaseSchema.omit({
  author: true,
}).extend({});

export const PublishedPostForApiSchema = PostBaseSchema.extend({
  id: z.string().default(""),
  slug: z.string().default(""),
  title: z.string().default(""),
  excerpt: z.string().default(""),
  author: UserSchema.optional().default({
    id: "",
    email: "",
    name: "",
  }),
  content: z.string().default(""),
  coverImageUrl: z.string().default(""),
  createdAt: z.string().default(""),
});

export type CreatePostForApiDto = z.infer<typeof CreatePostForApiSchema>;
export type UpdatePostForApiDto = z.infer<typeof UpdatePostForApiSchema>;
export type PublishedPostForApiDto = z.infer<typeof PublishedPostForApiSchema>;
