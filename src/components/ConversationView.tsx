
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import VideoCall from "./VideoCall";
import { timeAgo } from "@/utils/dataUtils";

export interface Contact {
  id: string;
  name: string;
  photoUrl: string;
  online?: boolean;
}

export interface Message {
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
  sendingMessage?: boolean;
}

const ConversationView = ({
  contact,
  messages,
  currentUserId,
  onSendMessage,
  sendingMessage = false,
}: ConversationViewProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInVideoCall, setIsInVideoCall] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendingMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const startVideoCall = () => {
    setIsInVideoCall(true);
  };

  const endVideoCall = () => {
    setIsInVideoCall(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={contact.photoUrl} alt={contact.name} />
            <AvatarFallback>
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">
              {contact.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={startVideoCall}
          title="Start video call"
        >
          <Video className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Call Overlay */}
      {isInVideoCall && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <VideoCall 
            userId={contact.id}
            username={contact.name}
            onEndCall={endVideoCall}
            timeLimit={300} // 5 minutes (300 seconds)
          />
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSentByMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 
                  ${
                    isSentByMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border"
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                  <span className="text-xs opacity-70 block text-right mt-1">
                    {timeAgo(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[45px] max-h-[120px] resize-none flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={sendingMessage}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!message.trim() || sendingMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;
