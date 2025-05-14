
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileImage from "./ProfileImage";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  photoUrl?: string;
  matchDate?: string; // Make matchDate optional
  matchPercentage?: number; // Add matchPercentage
  tags: string[];
  bio?: string; // Make bio optional
  onChat?: () => void; // Make onChat optional
  onLike?: () => void; // Add onLike handler
  onPass?: () => void; // Add onPass handler
  onMessage?: () => void; // Add onMessage handler
  userId?: string;
}

const MatchCard = ({
  name,
  age,
  location,
  photoUrl,
  matchDate,
  matchPercentage,
  tags,
  bio,
  onChat,
  onLike,
  onPass,
  onMessage,
  userId
}: MatchCardProps) => {
  const navigate = useNavigate();
  
  // Handle view profile click
  const handleViewProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  
  // Use the appropriate click handler based on what's provided
  const handleActionClick = onChat || onMessage || (() => {});
  
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
            {matchDate && <p className="text-xs text-muted-foreground">Matched {matchDate}</p>}
            {matchPercentage && <p className="text-xs text-primary">{matchPercentage}% Match</p>}
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
        {onLike && onPass ? (
          <>
            <Button variant="outline" className="w-full" onClick={onPass}>
              Pass
            </Button>
            <Button className="w-full" onClick={onLike}>
              Like
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" className="w-full" onClick={handleViewProfile}>
              View Profile
            </Button>
            <Button className="w-full" onClick={handleActionClick}>
              <MessageSquare className="mr-2 h-4 w-4" /> {onChat ? "Chat" : "Message"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
