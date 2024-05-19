import { useSession } from "next-auth/react";

export function useUser() {
  const session = useSession();
  return {
    id: session?.data?.user?.id,
    user: session.data?.user,
  };
}