
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Video, Phone, Smile, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import VideoCall from "./VideoCall";

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
      {/* Header - WhatsApp Style */}
      <div className="flex items-center justify-between p-4 bg-[#075e54] text-white shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.photoUrl} alt={contact.name} />
            <AvatarFallback className="bg-gray-300 text-gray-700">
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{contact.name}</h3>
            <p className="text-xs text-gray-200">
              {contact.online ? "online" : "last seen recently"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {/* Voice call */}}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={startVideoCall}
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
            timeLimit={300}
          />
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] space-y-2" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
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
              (index > 0 && new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000);
            
            return (
              <div key={msg.id} className="space-y-1">
                {showTime && (
                  <div className="flex justify-center">
                    <span className="text-xs text-gray-500 bg-white/70 px-3 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm relative ${
                      isSentByMe
                        ? "bg-[#dcf8c6] text-gray-800 rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {isSentByMe && (
                        <div className="text-xs text-gray-500">✓✓</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#f0f0f0] border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative bg-white rounded-full">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              className="min-h-[48px] max-h-[120px] resize-none rounded-full border-none focus:ring-0 px-4 py-3 pr-20"
              disabled={sendingMessage}
              rows={1}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" className="p-1">
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon"
            className="rounded-full bg-[#25d366] hover:bg-[#20bd5a] h-12 w-12 flex-shrink-0"
            disabled={!message.trim() || sendingMessage}
          >
            {message.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;
