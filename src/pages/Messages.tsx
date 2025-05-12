
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MessageList from "@/components/MessageList";
import ConversationView from "@/components/ConversationView";
import { chatService } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { logAllModelData } from "@/utils/debugLogger";

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Run debug logging on component mount
  useEffect(() => {
    const runDebugLogging = async () => {
      try {
        await logAllModelData();
      } catch (error) {
        console.error("Debug logging failed:", error);
      }
    };
    
    runDebugLogging();
  }, []);
  
  // Fix: Ensure the selected contact is the other person in the conversation, not yourself
  const getSelectedContact = () => {
    if (!selectedConversationId || !selectedConversation) return null;
    
    return {
      id: selectedConversationId,
      name: `${selectedConversation.userDetails.fname} ${selectedConversation.userDetails.lname}`,
      photoUrl: "", // We need to add profile photo support
      online: false // We need to add online status
    };
  };
  
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        console.log("Conversations:", data);
        setConversations(data || []);  // Fix: Handle case when data is undefined
        
        // Select first conversation if available
        if (data && data.length > 0 && !selectedConversationId) {
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
          setMessages(data || []); // Fix: Handle case when data is undefined
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
      
      if (response) { // Fix: Check if response exists
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
      }
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
    lastMessage: conv.lastMessage?.message || "No messages yet", // Fix: Handle undefined lastMessage
    timestamp: formatTimestamp(conv.lastMessage?.created || ""), // Fix: Handle undefined created
    unread: (conv.lastMessage?.status === "UNREAD" && conv.unreadCount > 0) || false // Fix: Handle undefined status
  }));
  
  // Format message data for ConversationView component
  const formattedMessages = messages.map(msg => ({
    id: msg._id || msg.id || "",  // Fix: Provide default value
    content: msg.message || msg.content || "",  // Fix: Provide default value
    senderId: msg.senderId || "",  // Fix: Provide default value
    timestamp: formatTimestamp(msg.created || msg.timestamp || "")  // Fix: Provide default value
  }));
  
  const selectedContact = getSelectedContact();
  
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
            <p className="text-muted-foreground mt-2">Start browsing to find someone to chat with!</p>
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
            <div className="hidden md:flex md:w-2/3 bg-white rounded-lg border overflow-hidden">
              {selectedContact ? (
                <ConversationView
                  contact={selectedContact}
                  messages={formattedMessages}
                  currentUserId={user?._id || ""}
                  onSendMessage={handleSendMessage}
                />
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
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ''; // Fix: Handle invalid date
    
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
  } catch (error) {
    console.error("Error formatting timestamp:", error, timestamp);
    return '';
  }
};

export default Messages;
