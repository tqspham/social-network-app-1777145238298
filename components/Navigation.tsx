"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { LogOut, Home, User } from "lucide-react";
import Link from "next/link";

export function Navigation(): React.ReactElement {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-bold text-xl">
          <Home className="h-6 w-6" />
          <span>Feed</span>
        </Link>

        <div className="flex items-center space-x-6">
          {user && (
            <>
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                aria-label="View profile"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
