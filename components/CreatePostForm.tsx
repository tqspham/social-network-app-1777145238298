"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  likes: string[];
  createdAt: string;
}

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

export function CreatePostForm({
  onPostCreated,
}: CreatePostFormProps): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const data: { error?: string } = await response.json();
        setError(data.error || "Failed to create post");
        return;
      }

      const newPost: Post = await response.json();
      onPostCreated(newPost);
      setContent("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={`https://loremflickr.com/40/40/avatar`}
            alt="Your profile picture"
            className="h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex-grow">
          <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">
            What's on your mind?
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            aria-label="Post content"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Publish post"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
