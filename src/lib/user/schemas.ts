import { z } from "zod";
const CreateBaseUser = z.object({
  name: z.string().trim().min(4, "Nome precisa ter no mínimo 4 caracteres"),
  email: z.string().trim().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .trim()
    .min(6, "Senha precisa ter pelo menos 6 caracteres"),
  password2: z
    .string()
    .trim()
    .min(6, "A confirmação de senha precisa ter pelo menos 6 caracteres"),
});

export const CreateUserSchema = CreateBaseUser.refine(
  (data) => {
    return data.password === data.password2;
  },
  {
    path: ["password2"],
    message: "As senhas informadas estão diferentes uma da outra",
  }
).transform(({ email, name, password }) => {
  return {
    name,
    email,
    password,
  };
});

export const UserSchema = z.object({
  id: z.string().default(""),
  name: z.string().default(""),
  email: z.string().default(""),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(6, "Senha precisa ter pelo menos 6 caracteres"),
    newPassword: z
      .string()
      .trim()
      .min(6, "Nova senha precisa ter pelo menos 6 caracteres"),
    confirmNewPassword: z
      .string()
      .trim()
      .min(6, "Confirmação da nova senha precisa ter pelo menos 6 caracteres"),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmNewPassword;
    },
    {
      path: ["confirmNewPassword"],
      message: "As senhas informadas estão diferentes uma da outra",
    }
  )
  .transform(({ currentPassword, newPassword }) => {
    return {
      currentPassword,
      newPassword,
    };
  });

export const UpdateUserSchema = CreateBaseUser.omit({
  password: true,
  password2: true,
}).extend({});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserSchemaDto = z.infer<typeof UserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
