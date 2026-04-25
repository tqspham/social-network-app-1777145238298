import { NextRequest, NextResponse } from "next/server";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse> {
  try {
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}
