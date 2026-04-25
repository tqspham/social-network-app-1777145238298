import { cookies } from "next/headers";

interface User {
  id: string;
  email: string;
}

const mockUsers: User[] = [
  { id: "1", email: "demo@example.com" },
  { id: "2", email: "alice@example.com" },
  { id: "3", email: "bob@example.com" },
];

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  const user = mockUsers.find((u) => u.id === userId);
  return user || null;
}
