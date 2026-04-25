import { NextRequest, NextResponse } from "next/server";

interface User {
  id: string;
  email: string;
}

const users: User[] = [
  { id: "1", email: "demo@example.com" },
  { id: "2", email: "alice@example.com" },
  { id: "3", email: "bob@example.com" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await params;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
