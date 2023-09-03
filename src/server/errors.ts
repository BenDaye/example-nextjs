import { TRPCError } from '@trpc/server';

export const CommonTRPCErrorMap = {
  UNAUTHORIZED: '无权访问',
  INVALID_ID: '无效ID',
  INVALID_TOKEN: '无效验证码',
  INVALID_PASSWORD: '无效密码',
  INVALID_CONFIG: '无效配置',
  INVALID_PARAMS: '无效参数',
  EXISTED_USERNAME: '用户名已存在',
  EXISTED_SECRET: '密钥已绑定',
  NOT_FOUND_DATA: '数据不存在',
  NOT_FOUND_USER: '用户不存在',
  NOT_FOUND_SECRET: '密钥未绑定',
} as const;

export type CommonTRPCErrorType = keyof typeof CommonTRPCErrorMap;

export const CommonTRPCErrorToTRPCError: Record<
  CommonTRPCErrorType,
  TRPCError
> = {
  UNAUTHORIZED: new TRPCError({
    code: 'UNAUTHORIZED',
    message: CommonTRPCErrorMap.UNAUTHORIZED,
  }),
  INVALID_ID: new TRPCError({
    code: 'BAD_REQUEST',
    message: CommonTRPCErrorMap.INVALID_ID,
  }),
  INVALID_TOKEN: new TRPCError({
    code: 'BAD_REQUEST',
    message: CommonTRPCErrorMap.INVALID_TOKEN,
  }),
  INVALID_PASSWORD: new TRPCError({
    code: 'BAD_REQUEST',
    message: CommonTRPCErrorMap.INVALID_PASSWORD,
  }),
  INVALID_CONFIG: new TRPCError({
    code: 'BAD_REQUEST',
    message: CommonTRPCErrorMap.INVALID_CONFIG,
  }),
  INVALID_PARAMS: new TRPCError({
    code: 'PARSE_ERROR',
    message: CommonTRPCErrorMap.INVALID_PARAMS,
  }),
  EXISTED_USERNAME: new TRPCError({
    code: 'CONFLICT',
    message: CommonTRPCErrorMap.EXISTED_USERNAME,
  }),
  EXISTED_SECRET: new TRPCError({
    code: 'CONFLICT',
    message: CommonTRPCErrorMap.EXISTED_SECRET,
  }),
  NOT_FOUND_DATA: new TRPCError({
    code: 'NOT_FOUND',
    message: CommonTRPCErrorMap.NOT_FOUND_DATA,
  }),
  NOT_FOUND_USER: new TRPCError({
    code: 'NOT_FOUND',
    message: CommonTRPCErrorMap.NOT_FOUND_USER,
  }),
  NOT_FOUND_SECRET: new TRPCError({
    code: 'NOT_FOUND',
    message: CommonTRPCErrorMap.NOT_FOUND_SECRET,
  }),
} as const;

export class CommonTRPCError extends TRPCError {
  constructor(key: CommonTRPCErrorType, cause?: unknown) {
    const { code, message } = CommonTRPCErrorToTRPCError[key];
    super({ code, message, cause });
  }
}
