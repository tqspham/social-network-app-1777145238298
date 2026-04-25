import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty"),
});

type CreatePostRequest = z.infer<typeof createPostSchema>;

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  likes: string[];
  createdAt: string;
}

let posts: Post[] = [
  {
    id: "1",
    userId: "2",
    userEmail: "alice@example.com",
    content: "Just finished an amazing project! Feeling productive today.",
    likes: ["1", "3"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "3",
    userEmail: "bob@example.com",
    content: "Beautiful sunset at the beach today 🌅",
    likes: ["1"],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    userEmail: "demo@example.com",
    content: "Hello everyone! Welcome to my social feed.",
    likes: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const sortedPosts = [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedPosts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const { content } = createPostSchema.parse(body);

    const users = [
      { id: "1", email: "demo@example.com" },
      { id: "2", email: "alice@example.com" },
      { id: "3", email: "bob@example.com" },
    ];

    const user = users.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPost: Post = {
      id: String(Date.now()),
      userId,
      userEmail: user.email,
      content,
      likes: [],
      createdAt: new Date().toISOString(),
    };

    posts.unshift(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
