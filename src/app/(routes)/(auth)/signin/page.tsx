import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Form } from "@/app/(routes)/(auth)/signin/form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }
  return <Form />;
}