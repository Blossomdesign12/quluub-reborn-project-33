
import { useState } from "react";
import Navbar from "@/components/Navbar";
import MessageList from "@/components/MessageList";
import ConversationView from "@/components/ConversationView";

const Messages = () => {
  // In a real app, this would come from an API or context
  const currentUserId = "user1";
  
  const conversationsData = [
    {
      id: "conv1",
      name: "Sarah",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150",
      lastMessage: "Hey, how are you doing?",
      timestamp: "10:30 AM",
      unread: true,
      messages: [
        {
          id: "msg1",
          content: "Hey there! I saw you like photography too.",
          senderId: "conv1",
          timestamp: "10:15 AM"
        },
        {
          id: "msg2",
          content: "Yes! I love taking landscape photos when I travel.",
          senderId: currentUserId,
          timestamp: "10:20 AM"
        },
        {
          id: "msg3",
          content: "That's awesome! What camera do you use?",
          senderId: "conv1",
          timestamp: "10:22 AM"
        },
        {
          id: "msg4",
          content: "I have a Sony A7III, but sometimes I just use my phone.",
          senderId: currentUserId,
          timestamp: "10:25 AM"
        },
        {
          id: "msg5",
          content: "Hey, how are you doing?",
          senderId: "conv1",
          timestamp: "10:30 AM"
        }
      ],
      online: true
    },
    {
      id: "conv2",
      name: "Michael",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150",
      lastMessage: "Let me know when you're free to meet up!",
      timestamp: "Yesterday",
      unread: false,
      messages: [
        {
          id: "msg1",
          content: "Hi, I noticed we both like hiking!",
          senderId: currentUserId,
          timestamp: "Yesterday"
        },
        {
          id: "msg2",
          content: "Yes! I try to go every weekend. What's your favorite trail?",
          senderId: "conv2",
          timestamp: "Yesterday"
        },
        {
          id: "msg3",
          content: "I love the mountain trails just outside the city. Have you been there?",
          senderId: currentUserId,
          timestamp: "Yesterday"
        },
        {
          id: "msg4",
          content: "Not yet, but I'd love to check it out sometime.",
          senderId: "conv2",
          timestamp: "Yesterday"
        },
        {
          id: "msg5",
          content: "Let me know when you're free to meet up!",
          senderId: "conv2",
          timestamp: "Yesterday"
        }
      ],
      online: false
    },
  ];
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("conv1");
  const [conversations, setConversations] = useState(conversationsData);
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const handleSendMessage = (content: string) => {
    if (selectedConversationId) {
      const newMessage = {
        id: `msg${Date.now()}`,
        content,
        senderId: currentUserId,
        timestamp: "Just now"
      };
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: content,
                timestamp: "Just now"
              }
            : conv
        )
      );
    }
  };
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark as read when selected
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === id
          ? { ...conv, unread: false }
          : conv
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container flex-1 py-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="flex flex-1 gap-6 h-[calc(100vh-200px)]">
          {/* Message list sidebar */}
          <div className="w-full md:w-1/3 bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <MessageList 
                conversations={conversations}
                selectedId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          </div>
          
          {/* Conversation view */}
          <div className="hidden md:flex md:w-2/3 bg-white rounded-lg border overflow-hidden">
            {selectedConversation ? (
              <ConversationView
                contact={{
                  id: selectedConversation.id,
                  name: selectedConversation.name,
                  photoUrl: selectedConversation.photoUrl,
                  online: selectedConversation.online
                }}
                messages={selectedConversation.messages}
                currentUserId={currentUserId}
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
      </main>
    </div>
  );
};

export default Messages;
