import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageSquare } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

export interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  photoUrl: string;
  tags: string[];
  userId: string;
  matchPercentage?: number; // Make this optional
  onLike: () => Promise<void>;
  onPass: () => void;
  onMessage: () => void;
}

const MatchCard = ({
  name,
  age,
  location,
  photoUrl,
  tags,
  userId,
  matchPercentage,
  onLike,
  onPass,
  onMessage,
}: MatchCardProps) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={3/4}>
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </AspectRatio>
        
        {matchPercentage && (
          <Badge className="absolute top-2 right-2 bg-teal-500">
            {matchPercentage}% Match
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{name}, {age}</h3>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full flex-1 border-red-200 hover:bg-red-50 hover:text-red-500"
            onClick={onPass}
          >
            <X className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full flex-1 border-blue-200 hover:bg-blue-50 hover:text-blue-500"
            onClick={onMessage}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full flex-1 border-green-200 hover:bg-green-50 hover:text-green-500"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`h-5 w-5 ${isLiking ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
