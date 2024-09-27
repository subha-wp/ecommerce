/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ThinkingAnimation } from "./ThinkingAnimation";
import { ChevronDown } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface Chat {
  id: string;
  title: string;
}
interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | undefined;
  googleId?: string | null;
  email?: string;
}

interface ChatWindowProps {
  user: User;
  chat: Chat;
  onUpdateChat: (updatedChat: Chat) => void;
}

export function ChatWindow({ chat, onUpdateChat, user }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [chat]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chats/${chat.id}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
      setTimeout(() => scrollToBottom(), 100); // Scroll to bottom after messages are rendered
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch(`/api/chats/${chat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data.aiMessage]);

      if (messages.length === 0) {
        // Update chat title with the first few words of the user's message
        const newTitle = input.split(" ").slice(0, 5).join(" ") + "...";
        onUpdateChat({ ...chat, title: newTitle });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsThinking(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
      return () => scrollArea.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative flex h-full flex-col">
      <div className="h-6"></div>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`mb-2 ${
              message.role === "user" ? "ml-auto" : "mr-auto"
            } w-fit min-w-[20%]`}
          >
            <CardContent className="p-3">
              <div className="font-semibold">
                {message.role === "user" ? user.displayName : "Assistant"}
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert"
              >
                {message.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        ))}
        {isThinking && (
          <Card className="mb-4 mr-auto max-w-[80%]">
            <CardContent className="p-3">
              <div className="mb-1 font-semibold">Assistant</div>
              <ThinkingAnimation />
            </CardContent>
          </Card>
        )}
        <div ref={bottomRef} />
      </ScrollArea>
      {showScrollButton && (
        <Button
          className="absolute bottom-20 right-4 rounded-full p-2"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
