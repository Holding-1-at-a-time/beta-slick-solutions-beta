import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function NotificationsPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }
