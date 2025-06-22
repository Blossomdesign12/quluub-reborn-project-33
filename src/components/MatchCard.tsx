
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

interface MatchCardProps {
  name: string;
  username?: string;
  age: number;
  location: string;
  photoUrl?: string;
  matchPercentage?: number;
  tags?: string[];
  userId: string;
  summary?: string;
  onLike?: () => void;
  onPass?: () => void;
  onMessage?: () => void;
  onFavorite?: () => void;
  onSendRequest?: () => void;
}

const MatchCard = ({ 
  name, 
  username,
  age, 
  location, 
  photoUrl, 
  matchPercentage, 
  tags = [], 
  userId,
  summary,
  onLike, 
  onPass, 
  onMessage,
  onFavorite,
  onSendRequest
}: MatchCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  const handleHide = () => {
    setIsHidden(true);
    onPass?.();
  };

  const handleSendRequest = () => {
    onSendRequest?.();
  };

  if (isHidden) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
        {/* Display summary text instead of profile picture */}
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <User className="h-8 w-8 text-white" />
          </div>
          {summary && (
            <p className="text-white text-sm line-clamp-3 max-w-xs">
              {summary}
            </p>
          )}
        </div>
        
        {matchPercentage && (
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-primary">{matchPercentage}% match</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <Link to={`/profile/${userId}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-primary cursor-pointer">
              {username || name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{age} • {location}</p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isFavorited ? "default" : "outline"}
            onClick={handleFavorite}
            className="flex-1"
          >
            <Star className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Favorited' : 'Favorite'}
          </Button>
          
          <Button
            size="sm"
            onClick={handleSendRequest}
            className="flex-1"
          >
            <Heart className="h-4 w-4 mr-1" />
            Send Request
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleHide}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
