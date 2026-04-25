import { redirect } from "next/navigation";
import { FeedPage } from "@/components/FeedPage";
import { getCurrentUser } from "@/app/api/auth/getCurrentUser";

export default async function Home(): Promise<React.ReactElement> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <FeedPage />;
}
