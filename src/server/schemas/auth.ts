import { z } from 'zod';
import { CommonMessage } from '../messages';
import {
  idSchema,
  passwordSchema,
  tokenSchema as token,
  usernameSchema,
} from './common';

export const tokenSchema = z.object({
  token,
});
export type TokenSchema = z.infer<typeof tokenSchema>;

export const signUpSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = signUpSchema.extend({});
export type SignInSchema = z.infer<typeof signInSchema>;

export const bindTokenSchema = tokenSchema.extend({
  secret: z.string({ required_error: CommonMessage.REQUIRED }),
});
export type BindTokenSchema = z.infer<typeof bindTokenSchema>;

export const unbindTokenSchema = z.object({
  id: idSchema,
});
export type UnbindTokenSchema = z.infer<typeof unbindTokenSchema>;

export const forgotPasswordSchema = z.object({
  username: usernameSchema,
  newPassword: passwordSchema,
  token,
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  newPassword: passwordSchema,
  token: token.optional(),
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
