
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";

interface Contact {
  id: string;
  name: string;
  photoUrl?: string;
  online?: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface ConversationViewProps {
  contact: Contact;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

const ConversationView = ({
  contact,
  messages,
  currentUserId,
  onSendMessage,
}: ConversationViewProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {isInCall ? (
        <VideoCall
          userId={contact.id}
          username={contact.name}
          onEndCall={endCall}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contact.photoUrl || ""} />
                <AvatarFallback>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{contact.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {contact.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={startCall}
              title="Start video call"
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!messageInput.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationView;
