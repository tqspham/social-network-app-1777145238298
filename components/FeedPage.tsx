"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PostCard } from "@/components/PostCard";
import { Navigation } from "@/components/Navigation";

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export function FeedPage(): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost: Post): void => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId: string): void => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleLikeToggled = (postId: string, likes: string[]): void => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likes } : p))
    );
  };

  return (
    <>
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <CreatePostForm onPostCreated={handlePostCreated} />

        <div className="mt-8 space-y-6">
          {error && (
            <div
              className="rounded-md bg-red-50 p-4 border border-red-200"
              role="alert"
            >
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading posts...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id || ""}
                onLikeToggled={handleLikeToggled}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
