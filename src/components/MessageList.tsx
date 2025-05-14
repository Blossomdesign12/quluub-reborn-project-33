
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  photoUrl?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface MessageListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
}

const MessageList = ({
  conversations,
  selectedId,
  onSelectConversation,
}: MessageListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search input */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 border-b border-border/50",
                selectedId === conversation.id && "bg-accent"
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <Avatar>
                <AvatarImage src={conversation.photoUrl || ""} />
                <AvatarFallback>
                  {conversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{conversation.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread && (
                    <Badge variant="default" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
