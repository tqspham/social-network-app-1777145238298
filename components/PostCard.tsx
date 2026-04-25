"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  likes: string[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLikeToggled: (postId: string, likes: string[]) => void;
  onPostDeleted: (postId: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLikeToggled,
  onPostDeleted,
}: PostCardProps): React.ReactElement {
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const hasLiked = post.likes.includes(currentUserId);
  const createdDate = new Date(post.createdAt);
  const timeAgo = getTimeAgo(createdDate);

  const handleLike = async (): Promise<void> => {
    setIsLiking(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      if (response.ok) {
        const updatedPost: Post = await response.json();
        onLikeToggled(post.id, updatedPost.likes);
      }
    } catch (error) {
      // Like toggle failed
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        <img
          src={`https://loremflickr.com/48/48/avatar`}
          alt={`${post.userEmail} profile picture`}
          className="h-12 w-12 rounded-full flex-shrink-0"
        />
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/profile/${post.userId}`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {post.userEmail}
              </Link>
              <p className="text-sm text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <p className="mt-2 text-gray-700">{post.content}</p>
          <div className="mt-4 flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-600 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={hasLiked ? "Unlike post" : "Like post"}
            >
              <Heart
                className={twMerge(
                  "h-5 w-5 transition-colors",
                  hasLiked && "fill-red-600 text-red-600"
                )}
              />
              <span className="text-sm font-medium group-hover:text-red-600">
                {post.likes.length}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
