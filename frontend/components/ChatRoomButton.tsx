"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

const ChatRoomButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      title="Connect through video, voice, or text chat"
      onClick={() => router.push("/chat")}
      className="fixed bottom-8 right-3 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-400/50 transition-all duration-300 group"
      aria-label="Open Chat Room"
    >
      <MessageCircle className="w-4 h-4 group-hover:animate-bounce" />
      <span className="font-medium text-xs">Interactive Room</span>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
    </button>
  );
};

export default ChatRoomButton;
