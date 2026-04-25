import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/api/auth/getCurrentUser";

export default async function LoginPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
