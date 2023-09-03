import { prisma } from '@/server/modules/prisma';
import { signInSchema } from '@/server/schemas/auth';
import { Prisma, UserRole } from '@prisma/client';
import { verify } from 'argon2';
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  password: true,
  role: true,
  username: true,
  UserProfile: {
    select: {
      nickname: true,
      email: true,
    },
  },
});

export const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 30 * 60 * 24 * 7,
  },
  providers: [
    CredentialsProvider({
      id: 'credentials-admin',
      name: 'Credentials Admin',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const valid = await signInSchema.spa(credentials);
          if (!valid.success) throw new Error(valid.error.message);
          const { username, password } = valid.data;

          const result = await prisma.user.findFirst({
            where: {
              username,
              role: UserRole.ADMIN,
            },
            select,
          });

          if (!result) throw new Error('用户不存在，或密码不匹配');
          if (!(await verify(result.password, password)))
            throw new Error('用户不存在，或密码不匹配');

          return {
            id: result.id,
            username: result.username,
            role: result.role,
            name: result.UserProfile?.nickname,
            email: result.UserProfile?.email,
          };
        } catch (error) {
          console.log(error);
          if (error instanceof Error) {
            throw error;
          }
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'credentials-user',
      name: 'Credentials User',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const valid = await signInSchema.spa(credentials);
          if (!valid.success) throw new Error(valid.error.message);
          const { username, password } = valid.data;

          const result = await prisma.user.findFirst({
            where: {
              username,
              role: UserRole.USER,
            },
            select,
          });

          if (!result) throw new Error('用户不存在，或密码不匹配');
          if (!(await verify(result.password, password)))
            throw new Error('用户不存在，或密码不匹配');

          return {
            id: result.id,
            username: result.username,
            role: result.role,
            name: result.UserProfile?.nickname,
            email: result.UserProfile?.email,
          };
        } catch (error) {
          console.log(error);
          if (error instanceof Error) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
