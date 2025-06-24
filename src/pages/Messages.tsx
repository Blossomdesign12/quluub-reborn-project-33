import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MessageList from "@/components/MessageList";
import ConversationView from "@/components/ConversationView";
import { chatService, userService } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, MessageSquare, Users, Wallet, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newConversationUser, setNewConversationUser] = useState<any>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  
  // Check URL for conversation or match parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const conversationId = urlParams.get('conversation');
    const matchId = urlParams.get('matchId');
    
    if (conversationId) {
      setSelectedConversationId(conversationId);
      setNewConversationUser(null);
    } else if (matchId) {
      setSelectedConversationId(matchId);
      fetchUserForNewConversation(matchId);
    }
  }, [location.search]);
  
  const fetchUserForNewConversation = async (userId: string) => {
    try {
      setConversationLoading(true);
      const userData = await userService.getProfile(userId);
      setNewConversationUser(userData);
      setMessages([]);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    } finally {
      setConversationLoading(false);
    }
  };
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        setConversations(data);
        
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
          const data = await chatService.getMessages(selectedConversationId);
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
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
    }
  }, [selectedConversationId, newConversationUser, toast]);
  
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) {
      return;
    }
    
    try {
      setSendingMessage(true);
      const response = await chatService.sendMessage(selectedConversationId, content);
      
      const newMessage = {
        id: response._id,
        _id: response._id,
        content: response.message,
        message: response.message,
        senderId: response.senderId,
        receiverId: response.receiverId,
        timestamp: new Date().toISOString(),
        created: response.created,
        status: response.status
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
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
        navigate(`/messages?conversation=${selectedConversationId}`, { replace: true });
      } else {
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
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setNewConversationUser(null);
    navigate(`/messages?conversation=${id}`, { replace: true });
  };
  
  const getConversationContact = () => {
    if (selectedConversation) {
      return {
        id: selectedConversation._id,
        name: `${selectedConversation.userDetails.fname} ${selectedConversation.userDetails.lname}`,
        photoUrl: "",
        online: Math.random() > 0.5
      };
    } else if (newConversationUser) {
      return {
        id: selectedConversationId!,
        name: `${newConversationUser.fname} ${newConversationUser.lname}`,
        photoUrl: "",
        online: true
      };
    }
    return null;
  };
  
  const conversationContact = getConversationContact();
  
  const formattedConversations = conversations.map(conv => ({
    id: conv._id,
    name: `${conv.userDetails.fname} ${conv.userDetails.lname}`,
    photoUrl: "",
    lastMessage: conv.lastMessage.message,
    timestamp: formatTimestamp(conv.lastMessage.created),
    unread: conv.lastMessage.status === "UNREAD" && conv.unreadCount > 0
  }));
  
  const formattedMessages = messages.map(msg => ({
    id: msg._id || msg.id,
    content: msg.message || msg.content,
    senderId: msg.senderId,
    timestamp: msg.created || msg.timestamp
  }));

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-16 bg-[#075e54] flex flex-col items-center py-4 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profile_pic} alt={user?.fname} />
            <AvatarFallback className="bg-white text-[#075e54] font-medium">
              {user?.fname?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-xs font-medium truncate w-full text-center">
            {user?.fname || 'User'}
          </span>
        </div>
        
        <nav className="flex flex-col space-y-4 flex-1">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Users className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-white bg-white/20">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Link to="/wallet">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Wallet className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25d366]"></div>
          </div>
        ) : (
          <>
            {/* Message list sidebar */}
            <div className={`w-full ${selectedConversationId ? 'hidden' : 'block'} md:block md:w-1/3 bg-white overflow-hidden`}>
              <div className="p-4 bg-[#ededed] border-b">
                <h2 className="text-lg font-medium text-gray-800">Chats</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-64px)]">
                {conversations.length > 0 ? (
                  <MessageList 
                    conversations={formattedConversations}
                    selectedId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                  />
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {newConversationUser ? "Start your first conversation!" : "No conversations yet"}
                  </div>
                )}
              </div>
            </div>
            
            {/* Conversation view */}
            <div className={`${selectedConversationId ? 'block' : 'hidden'} md:block md:w-2/3 bg-white overflow-hidden flex flex-col`}>
              {conversationLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25d366]"></div>
                </div>
              ) : conversationContact ? (
                <>
                  {/* Mobile back button */}
                  <div className="md:hidden p-4 border-b bg-[#075e54] flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedConversationId(null)}
                      className="text-white"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <span className="font-medium text-white">Back to chats</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col h-full">
                    <ConversationView
                      contact={conversationContact}
                      messages={formattedMessages}
                      currentUserId={user?._id || ""}
                      onSendMessage={handleSendMessage}
                      sendingMessage={sendingMessage}
                      userPlan={user?.plan || 'free'}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-[#e5ddd5]">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-lg font-medium">Quluub Web</p>
                    <p className="text-sm">Send and receive messages without keeping your phone online.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
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
  
  if (diffInHours < 1) {
    return 'now';
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export default Messages;
