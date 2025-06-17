import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MessageList from "@/components/MessageList";
import ConversationView from "@/components/ConversationView";
import VideoCallRestriction from "@/components/VideoCallRestriction";
import { chatService } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

interface Conversation {
  _id: string;
  lastMessage: {
    message: string;
    created: string;
    status: string;
  };
  userDetails: {
    username: string;
    fname: string;
    lname: string;
    gender: string;
    country: string;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  _id: string;
  content: string;
  message: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  created: string;
  status: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  
  // Check URL for conversation parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const conversationId = urlParams.get('conversation');
    if (conversationId) {
      setSelectedConversationId(conversationId);
    }
  }, [location.search]);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        console.log("Conversations:", data);
        setConversations(data);
        
        // Select first conversation if available and no conversation selected from URL
        if (data.length > 0 && !selectedConversationId) {
          setSelectedConversationId(data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [toast]);
  
  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        try {
          const data = await chatService.getMessages(selectedConversationId);
          console.log("Messages:", data);
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          toast({
            title: "Error",
            description: "Failed to load messages",
            variant: "destructive",
          });
        }
      };
      
      fetchMessages();
    }
  }, [selectedConversationId, toast]);
  
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) return;
    
    try {
      setSendingMessage(true);
      const response = await chatService.sendMessage(selectedConversationId, content);
      
      // Update messages list with new message
      setMessages(prevMessages => [...prevMessages, {
        id: response._id,
        _id: response._id,
        content: response.message,
        message: response.message,
        senderId: response.senderId,
        receiverId: response.receiverId,
        timestamp: 'Just now',
        created: response.created,
        status: response.status
      }]);
      
      // Update conversation list with new last message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === selectedConversationId
            ? {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  message: content,
                  created: new Date().toISOString()
                }
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };
  
  // Format conversation data for MessageList component
  const formattedConversations = conversations.map(conv => ({
    id: conv._id,
    name: `${conv.userDetails.fname} ${conv.userDetails.lname}`,
    photoUrl: "", // We need to add profile photo support
    lastMessage: conv.lastMessage.message,
    timestamp: formatTimestamp(conv.lastMessage.created),
    unread: conv.lastMessage.status === "UNREAD" && conv.unreadCount > 0
  }));
  
  // Format message data for ConversationView component
  const formattedMessages = messages.map(msg => ({
    id: msg._id || msg.id,
    content: msg.message || msg.content,
    senderId: msg.senderId,
    timestamp: formatTimestamp(msg.created || msg.timestamp)
  }));
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container flex-1 py-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You don't have any conversations yet.</p>
            <p className="text-muted-foreground mt-2">Accept connection requests to start chatting!</p>
          </Card>
        ) : (
          <div className="flex flex-1 gap-6 h-[calc(100vh-200px)]">
            {/* Message list sidebar */}
            <div className="w-full md:w-1/3 bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium">Conversations</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                <MessageList 
                  conversations={formattedConversations}
                  selectedId={selectedConversationId}
                  onSelectConversation={handleSelectConversation}
                />
              </div>
            </div>
            
            {/* Conversation view */}
            <div className="hidden md:flex md:w-2/3 bg-white rounded-lg border overflow-hidden flex-col">
              {selectedConversation ? (
                <>
                  <div className="flex-1">
                    <ConversationView
                      contact={{
                        id: selectedConversation._id,
                        name: `${selectedConversation.userDetails.fname} ${selectedConversation.userDetails.lname}`,
                        photoUrl: "",
                        online: false
                      }}
                      messages={formattedMessages}
                      currentUserId={user?._id || ""}
                      onSendMessage={handleSendMessage}
                    />
                  </div>
                  
                  {/* Video Call Section */}
                  <div className="border-t p-4">
                    <VideoCallRestriction 
                      user={user!}
                      onStartCall={() => {
                        toast({
                          title: "Video Call Started",
                          description: "You have 5 minutes for this call",
                        });
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <p className="text-muted-foreground">
                    Select a conversation to start chatting
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper function to format timestamps
const formatTimestamp = (timestamp: string): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export default Messages;
