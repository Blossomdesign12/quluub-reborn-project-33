
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  bio: string;
  photoUrl: string;
  compatibility?: number;
  tags?: string[];
  onLike?: () => void;
  onPass?: () => void;
}

const MatchCard = ({
  name,
  age,
  location,
  bio,
  photoUrl,
  compatibility,
  tags = [],
  onLike,
  onPass
}: MatchCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-96">
        <img
          src={photoUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <h3 className="text-xl font-bold">{name}, {age}</h3>
          <p className="text-sm opacity-80">{location}</p>
          {compatibility && (
            <Badge className="mt-2 bg-primary/90 text-white hover:bg-primary">
              {compatibility}% Compatible
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{bio}</p>
        
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
      {(onLike || onPass) && (
        <CardFooter className="flex justify-center gap-4 p-4 pt-0">
          {onPass && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 hover:border-red-500 hover:bg-red-50"
              onClick={onPass}
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>
          )}
          {onLike && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 hover:border-green-500 hover:bg-green-50"
              onClick={onLike}
            >
              <Heart className="h-6 w-6 text-green-500" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default MatchCard;
