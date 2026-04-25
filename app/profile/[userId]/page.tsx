import { ProfilePage } from "@/components/ProfilePage";
import { getCurrentUser } from "@/app/api/auth/getCurrentUser";
import { redirect } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function Profile({
  params,
}: ProfilePageProps): Promise<React.ReactElement> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { userId } = await params;

  return <ProfilePage userId={userId} currentUserId={user.id} />;
}
