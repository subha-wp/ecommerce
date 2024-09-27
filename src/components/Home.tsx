/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { ChatWindow } from "./ChatWindow";

interface Chat {
  id: string;
  title: string;
}

export default function HomeUI({ user }: any) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Chat" }),
      });
      if (!response.ok) {
        throw new Error("Failed to create new chat");
      }
      const newChat = await response.json();
      setChats((prevChats) => [newChat, ...prevChats]);
      setSelectedChat(newChat);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const updateChat = async (updatedChat: Chat) => {
    try {
      const response = await fetch(`/api/chats/${updatedChat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedChat),
      });
      if (!response.ok) {
        throw new Error("Failed to update chat");
      }
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === updatedChat.id ? updatedChat : chat,
        ),
      );
      setSelectedChat(updatedChat);
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        user={user}
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onNewChat={createNewChat}
      />
      <main className="mx-auto max-w-4xl flex-1 overflow-hidden">
        {selectedChat ? (
          <ChatWindow
            user={user}
            chat={selectedChat}
            onUpdateChat={updateChat}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Button onClick={createNewChat}>Start a new chat</Button>
          </div>
        )}
      </main>
    </div>
  );
}
