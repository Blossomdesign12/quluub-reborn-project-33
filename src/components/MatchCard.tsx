
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileImage from "./ProfileImage";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  photoUrl?: string;
  matchDate: string;
  tags: string[];
  bio: string;
  onChat: () => void;
  userId?: string;
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
  userId
}: MatchCardProps) => {
  const navigate = useNavigate();
  
  // Handle view profile click
  const handleViewProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pt-4 px-4">
        <div className="flex items-center gap-3">
          <ProfileImage
            src={photoUrl || ""}
            alt={name}
            fallback={name.substring(0, 2).toUpperCase()}
            size="lg"
          />
          <div>
            <h3 className="font-semibold">{name}, {age}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
            <p className="text-xs text-muted-foreground">Matched {matchDate}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="flex-1 pt-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-sm line-clamp-3">{bio || "No bio available"}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 pt-2 pb-4">
        <Button variant="outline" className="w-full" onClick={handleViewProfile}>
          View Profile
        </Button>
        <Button className="w-full" onClick={onChat}>
          <MessageSquare className="mr-2 h-4 w-4" /> Chat
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
