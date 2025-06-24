
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors",
        isSelected && "bg-green-50 border-green-200"
      )}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback className="bg-green-200 text-green-800 font-medium">
          {name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className={cn(
            "font-medium text-gray-900 truncate", 
            unread && "font-semibold"
          )}>
            {name}
          </span>
          <span className={cn(
            "text-xs flex-shrink-0 ml-2",
            unread ? "text-green-600 font-medium" : "text-gray-500"
          )}>
            {timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm truncate", 
            unread ? "text-gray-900 font-medium" : "text-gray-600"
          )}>
            {lastMessage || "No messages yet"}
          </p>
          {unread && (
            <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center flex-shrink-0 ml-2 font-medium">
              1
            </span>
          )}
        </div>
      </div>
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
    <div className="divide-y divide-gray-100">
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
