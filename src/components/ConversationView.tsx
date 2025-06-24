
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Video, Phone } from "lucide-react";
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
  userPlan?: string;
}

const ConversationView = ({
  contact,
  messages,
  currentUserId,
  onSendMessage,
  sendingMessage = false,
  userPlan = 'free',
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startVideoCall = () => {
    if (userPlan === 'premium') {
      setIsInVideoCall(true);
    }
  };

  const endVideoCall = () => {
    setIsInVideoCall(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* WhatsApp-style Header */}
      <div className="p-4 border-b flex justify-between items-center bg-green-50 shadow-sm">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={contact.photoUrl} alt={contact.name} />
            <AvatarFallback className="bg-green-200">
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{contact.name}</h3>
            <p className="text-xs text-green-600">
              {contact.online ? "online" : "last seen recently"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-green-600 hover:bg-green-100"
            onClick={() => {/* Voice call */}}
            title="Voice call"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-green-600 hover:bg-green-100"
            onClick={startVideoCall}
            title={userPlan === 'premium' ? "Start video call (5 min limit)" : "Upgrade to premium for video calls"}
            disabled={userPlan !== 'premium'}
          >
            <Video className="h-5 w-5" />
          </Button>
        </div>
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

      {/* WhatsApp-style Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='nonzero'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium">Start your conversation</p>
              <p className="text-sm">Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSentByMe = msg.senderId === currentUserId;
            const showTime = index === 0 || 
              (index > 0 && new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000); // 5 minutes
            
            return (
              <div key={msg.id} className="space-y-1">
                {showTime && (
                  <div className="flex justify-center">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm relative
                    ${
                      isSentByMe
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-xs block text-right mt-1 ${
                      isSentByMe ? "text-green-100" : "text-gray-500"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp-style Message Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="min-h-[48px] max-h-[120px] resize-none rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500 pr-12"
              disabled={sendingMessage}
              rows={1}
            />
          </div>
          <Button 
            type="submit" 
            size="icon"
            className="rounded-full bg-green-500 hover:bg-green-600 h-12 w-12 flex-shrink-0"
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
