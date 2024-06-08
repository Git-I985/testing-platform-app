import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function getSessionUserData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { user: null, session: null };
  }

  const { user } = session;

  if (!user) {
    return { user: null, session };
  }

  return { user, session };
}