import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupRequest = z.infer<typeof signupSchema>;

interface User {
  id: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

let users: StoredUser[] = [
  { id: "1", email: "demo@example.com", password: "password123" },
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const { email, password } = signupSchema.parse(body);

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const newUser: StoredUser = {
      id: String(Date.now()),
      email,
      password,
    };

    users.push(newUser);

    const response = NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
      },
      { status: 201 }
    );

    response.cookies.set("userId", newUser.id, {
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
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
