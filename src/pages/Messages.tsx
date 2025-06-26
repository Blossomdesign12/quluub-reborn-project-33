import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { chatService } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

// Adjust the Message interface to match API response
interface Message {
  _id: string;
  senderId: string;
  message: string;
  createdAt: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Get conversation id
  const urlParams = new URLSearchParams(location.search);
  const conversationId = urlParams.get("conversation");

  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await chatService.getMessages(conversationId);
        console.log('Fetched messages:', data);
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load messages", err);
        toast({ title: "Error", description: "Could not load messages", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;
    try {
      const newMsg = await chatService.sendMessage(conversationId, messageText.trim());
      setMessages(prev => [...prev, newMsg]);
      setMessageText("");
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message", err);
      toast({ title: "Error", description: "Message not sent", variant: "destructive" });
    }
  };

  const startVideoCall = () => {
    if (!conversationId) return;
    navigate(`/video-call?conversation=${conversationId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <h2 className="ml-4 text-lg font-medium text-gray-800">Chat</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={startVideoCall}>
            <Video className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === user?.id;
              const dateObj = new Date(msg.createdAt);
              const timeLabel = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`${isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} max-w-xs px-4 py-2 rounded-xl`}> 
                    {msg.message}
                    {timeLabel && (
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {timeLabel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={sendMessage} className="rounded-xl px-4 py-2">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
