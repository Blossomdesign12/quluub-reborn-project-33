
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  photoUrl: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface MessageListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
}

const MessageList = ({ conversations, selectedId, onSelectConversation }: MessageListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="p-3 sticky top-0 bg-background z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="divide-y">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                selectedId === conversation.id && "bg-muted",
                conversation.unread && "bg-primary/5"
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.photoUrl} alt={conversation.name} />
                <AvatarFallback>
                  {conversation.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{conversation.name}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {conversation.timestamp}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm truncate",
                    conversation.unread
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
