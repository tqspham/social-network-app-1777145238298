"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
}

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  likes: string[];
  createdAt: string;
}

interface ProfilePageProps {
  userId: string;
  currentUserId: string;
}

export function ProfilePage({
  userId,
  currentUserId,
}: ProfilePageProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      setIsLoading(true);
      setError("");
      try {
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error("User not found");
        }
        const userData: User = await userResponse.json();
        setUser(userData);

        const postsResponse = await fetch(`/api/users/${userId}/posts`);
        if (postsResponse.ok) {
          const postsData: Post[] = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleLikeToggled = (postId: string, likes: string[]): void => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likes } : p))
    );
  };

  const handlePostDeleted = (postId: string): void => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div
            className="rounded-md bg-red-50 p-4 border border-red-200"
            role="alert"
          >
            <p className="text-sm font-medium text-red-800">
              {error || "User not found"}
            </p>
          </div>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Back to feed
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={`https://loremflickr.com/96/96/avatar`}
              alt={`${user.email} profile picture`}
              className="h-24 w-24 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.email}</h1>
              <p className="text-gray-500 mt-1">{posts.length} posts</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
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
