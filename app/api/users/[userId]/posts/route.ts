import { NextRequest, NextResponse } from "next/server";

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  likes: string[];
  createdAt: string;
}

const allPosts: Post[] = [
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
  {
    id: "4",
    userId: "2",
    userEmail: "alice@example.com",
    content: "Learning React is so much fun!",
    likes: ["3"],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await params;

    const userPosts = allPosts
      .filter((post) => post.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(userPosts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}
