import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MessageList from "@/components/MessageList";
import ConversationView from "@/components/ConversationView";
import VideoCallRestriction from "@/components/VideoCallRestriction";
import { chatService, userService } from "@/lib/api-client";
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
  const [newConversationUser, setNewConversationUser] = useState<any>(null);
  
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  
  // Check URL for conversation or match parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const conversationId = urlParams.get('conversation');
    const matchId = urlParams.get('matchId');
    
    console.log('URL params - conversation:', conversationId, 'matchId:', matchId);
    
    if (conversationId) {
      setSelectedConversationId(conversationId);
    } else if (matchId) {
      // This is a new conversation with a match
      setSelectedConversationId(matchId);
      fetchUserForNewConversation(matchId);
    }
  }, [location.search]);
  
  const fetchUserForNewConversation = async (userId: string) => {
    try {
      console.log('Fetching user details for new conversation:', userId);
      const userData = await userService.getProfile(userId);
      console.log('User data for new conversation:', userData);
      setNewConversationUser(userData);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    }
  };
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        console.log("Conversations:", data);
        setConversations(data);
        
        // Don't auto-select first conversation if we have a URL parameter
        const urlParams = new URLSearchParams(location.search);
        const hasUrlConversation = urlParams.get('conversation') || urlParams.get('matchId');
        
        if (data.length > 0 && !selectedConversationId && !hasUrlConversation) {
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
  }, []);
  
  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConversationId && !newConversationUser) {
      const fetchMessages = async () => {
        try {
          console.log('Fetching messages for conversation:', selectedConversationId);
          const data = await chatService.getMessages(selectedConversationId);
          console.log("Messages:", data);
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          // For new conversations, this is expected, so we'll start with empty messages
          if (error.response?.status === 404 || error.response?.status === 403) {
            setMessages([]);
          } else {
            toast({
              title: "Error",
              description: "Failed to load messages",
              variant: "destructive",
            });
          }
        }
      };
      
      fetchMessages();
    } else if (newConversationUser) {
      // New conversation, start with empty messages
      setMessages([]);
    }
  }, [selectedConversationId, newConversationUser, toast]);
  
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) {
      console.error('Cannot send message: missing conversation ID or content');
      return;
    }
    
    try {
      setSendingMessage(true);
      console.log('Sending message to:', selectedConversationId, 'Content:', content);
      
      const response = await chatService.sendMessage(selectedConversationId, content);
      console.log('Message sent successfully:', response);
      
      // Create message object for UI
      const newMessage = {
        id: response._id,
        _id: response._id,
        content: response.message,
        message: response.message,
        senderId: response.senderId,
        receiverId: response.receiverId,
        timestamp: 'Just now',
        created: response.created,
        status: response.status
      };
      
      // Update messages list with new message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // If this was a new conversation, add it to conversations list
      if (newConversationUser) {
        const newConversation = {
          _id: selectedConversationId,
          lastMessage: {
            message: content,
            created: new Date().toISOString(),
            status: 'SENT'
          },
          userDetails: {
            username: newConversationUser.username,
            fname: newConversationUser.fname,
            lname: newConversationUser.lname,
            gender: newConversationUser.gender,
            country: newConversationUser.country
          },
          unreadCount: 0
        };
        setConversations(prev => [newConversation, ...prev]);
        setNewConversationUser(null);
      } else {
        // Update existing conversation with new last message
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
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleSelectConversation = (id: string) => {
    console.log('Selecting conversation:', id);
    setSelectedConversationId(id);
    setNewConversationUser(null); // Clear new conversation user when selecting existing conversation
    
    // Update URL to reflect selected conversation
    const newUrl = `/messages?conversation=${id}`;
    window.history.replaceState({}, '', newUrl);
  };
  
  // Determine the contact for conversation view
  const getConversationContact = () => {
    if (selectedConversation) {
      return {
        id: selectedConversation._id,
        name: `${selectedConversation.userDetails.fname} ${selectedConversation.userDetails.lname}`,
        photoUrl: "",
        online: false
      };
    } else if (newConversationUser) {
      return {
        id: selectedConversationId!,
        name: `${newConversationUser.fname} ${newConversationUser.lname}`,
        photoUrl: "",
        online: false
      };
    }
    return null;
  };
  
  const conversationContact = getConversationContact();
  
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
        ) : (
          <div className="flex flex-1 gap-6 h-[calc(100vh-200px)]">
            {/* Message list sidebar */}
            <div className="w-full md:w-1/3 bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium">Conversations</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {conversations.length > 0 ? (
                  <MessageList 
                    conversations={formattedConversations}
                    selectedId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                  />
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {selectedConversationId ? "Start your first conversation!" : "No conversations yet"}
                  </div>
                )}
              </div>
            </div>
            
            {/* Conversation view - Always show if we have a selected conversation */}
            <div className="hidden md:flex md:w-2/3 bg-white rounded-lg border overflow-hidden flex-col">
              {conversationContact ? (
                <>
                  <div className="flex-1">
                    <ConversationView
                      contact={conversationContact}
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
            
            {/* Mobile view - show conversation when selected */}
            {selectedConversationId && conversationContact && (
              <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
                <div className="p-4 border-b flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedConversationId(null)}
                    className="text-primary"
                  >
                    ← Back
                  </button>
                  <h2 className="font-medium">{conversationContact.name}</h2>
                </div>
                <div className="flex-1">
                  <ConversationView
                    contact={conversationContact}
                    messages={formattedMessages}
                    currentUserId={user?._id || ""}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            )}
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
