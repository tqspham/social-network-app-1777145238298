import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginRequest = z.infer<typeof loginSchema>;

interface StoredUser {
  id: string;
  email: string;
  password: string;
}

let users: StoredUser[] = [
  { id: "1", email: "demo@example.com", password: "password123" },
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 200 }
    );

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to log in" },
      { status: 500 }
    );
  }
}
