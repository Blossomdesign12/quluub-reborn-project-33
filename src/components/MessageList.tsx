
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageListItemProps {
  name: string;
  photoUrl: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const MessageListItem = ({
  name,
  photoUrl,
  lastMessage,
  timestamp,
  unread,
  isSelected,
  onClick
}: MessageListItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-md cursor-pointer",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <span className={cn("font-medium", unread && "font-semibold")}>{name}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className={cn(
          "text-sm truncate", 
          unread ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {lastMessage}
        </p>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </div>
  );
};

interface MessageListProps {
  conversations: {
    id: string;
    name: string;
    photoUrl: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
  }[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
}

const MessageList = ({
  conversations,
  selectedId,
  onSelectConversation
}: MessageListProps) => {
  return (
    <div className="space-y-1">
      {conversations.map((convo) => (
        <MessageListItem
          key={convo.id}
          name={convo.name}
          photoUrl={convo.photoUrl}
          lastMessage={convo.lastMessage}
          timestamp={convo.timestamp}
          unread={convo.unread}
          isSelected={selectedId === convo.id}
          onClick={() => onSelectConversation(convo.id)}
        />
      ))}
    </div>
  );
};

export default MessageList;
