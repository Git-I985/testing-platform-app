import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      id: string;
      role: string | null;
      isAdmin: boolean;
      isManager: boolean;
      organisationId: number | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: { name: string } | null;
    organisationId: number | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's role */
    id: string;
    role: string | null;
    isAdmin: boolean;
    isManager: boolean;
    organisationId: number | null;
  }
}