
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  photoUrl?: string;
  matchDate: string;
  tags: string[];
  bio: string;
  onChat: () => void;
  userId: string | undefined;
}

const MatchCard = ({
  name,
  age,
  location,
  photoUrl,
  matchDate,
  tags,
  bio,
  onChat,
  userId,
}: MatchCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt={name} />
            ) : (
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{name}, {age}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
            <p className="text-xs mt-1">Matched {matchDate}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary">{tag}</Badge>
          ))}
        </div>
        
        <p className="text-sm mb-4 line-clamp-3">{bio}</p>
        
        <Button onClick={onChat} className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Chatting
        </Button>
      </div>
    </Card>
  );
};

export default MatchCard;
