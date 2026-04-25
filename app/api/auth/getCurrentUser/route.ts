import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userId = request.cookies.get("userId")?.value;

  if (!userId) {
    return NextResponse.json(null);
  }

  const users = [
    { id: "1", email: "demo@example.com" },
    { id: "2", email: "alice@example.com" },
    { id: "3", email: "bob@example.com" },
  ];

  const user = users.find((u) => u.id === userId);
  return NextResponse.json(user || null);
}
