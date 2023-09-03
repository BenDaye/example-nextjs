import { z } from 'zod';
import { CommonMessage } from '../messages';
import { CommonRegex } from '../regex';

export const listSchema = z.object({
  limit: z.coerce.number().int().gte(5).lte(100).default(20),
  skip: z.coerce.number().int().nonnegative().default(0).optional(),
  cursor: z.string().optional(),
  query: z.string().optional(),
});
export type ListSchema = z.infer<typeof listSchema>;

export const idSchema = z
  .string({
    required_error: CommonMessage.REQUIRED,
    invalid_type_error: CommonMessage.INVALID_TYPE_ERROR,
  })
  .cuid({ message: CommonMessage.INVALID_ID });
export type IdSchema = z.infer<typeof idSchema>;

export const usernameSchema = z
  .string({ required_error: CommonMessage.REQUIRED })
  .regex(CommonRegex.USERNAME, {
    message: CommonMessage.INVALID_USERNAME,
  });
export type UsernameSchema = z.infer<typeof usernameSchema>;

export const passwordSchema = z
  .string({ required_error: CommonMessage.REQUIRED })
  .regex(CommonRegex.PASSWORD, {
    message: CommonMessage.INVALID_PASSWORD,
  });
export type PasswordSchema = z.infer<typeof passwordSchema>;

export const tokenSchema = z
  .string({ required_error: CommonMessage.REQUIRED })
  .length(6, { message: CommonMessage.INVALID_TOKEN_LENGTH });
export type TokenSchema = z.infer<typeof tokenSchema>;

export const addressSchema = z.string().regex(CommonRegex.ADDRESS, {
  message: CommonMessage.INVALID_ADDRESS,
});
export type AddressSchema = z.infer<typeof addressSchema>;
