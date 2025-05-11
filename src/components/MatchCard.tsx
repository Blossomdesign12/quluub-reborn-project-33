
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, X, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileImage from "@/components/ProfileImage";

interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  bio?: string;
  photoUrl: string;
  compatibility?: number;
  matchPercentage?: number;
  matchDate?: string;
  tags?: string[];
  onLike?: () => void;
  onPass?: () => void;
  onChat?: () => void;
}

const MatchCard = ({
  name,
  age,
  location,
  bio = "",
  photoUrl,
  compatibility,
  matchPercentage,
  matchDate,
  tags = [],
  onLike,
  onPass,
  onChat
}: MatchCardProps) => {
  const generateInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-60">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <ProfileImage
              src=""
              alt={name}
              fallback={generateInitials(name)}
              size="lg"
              className="h-24 w-24 text-3xl"
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <h3 className="text-xl font-bold">{name}, {age}</h3>
          <p className="text-sm opacity-80">{location}</p>
          {(compatibility || matchPercentage) && (
            <Badge className="mt-2 bg-primary/90 text-white hover:bg-primary">
              {compatibility || matchPercentage}% Tawafuq (Compatibility)
            </Badge>
          )}
          {matchDate && (
            <p className="text-xs mt-1 opacity-75">Matched {matchDate}</p>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
        
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {(onLike || onPass || onChat) && (
        <CardFooter className="flex justify-center gap-4 p-4 pt-0">
          {onPass && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 hover:border-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onPass();
              }}
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>
          )}
          
          {onLike && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 hover:border-green-500 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              <Heart className="h-6 w-6 text-green-500" />
            </Button>
          )}
          
          {onChat && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 hover:border-blue-500 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                onChat();
              }}
            >
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default MatchCard;
