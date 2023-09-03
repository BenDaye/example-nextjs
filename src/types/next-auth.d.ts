import { UserRole } from '@prisma/client';
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      id?: string | null;
      username?: string | null;
      role?: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username?: string | null;
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    id?: string | null;
    username?: string | null;
    role?: UserRole;
  }
}
