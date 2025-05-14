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
  matchPercentage?: number;
  matchDate?: string;
  bio?: string;
  onLike?: () => Promise<void>;
  onPass?: () => void;
  onMessage?: () => void;
  onChat?: () => void;
}

const MatchCard = ({
  name,
  age,
  location,
  photoUrl,
  tags,
  userId,
  matchPercentage,
  matchDate,
  bio,
  onLike,
  onPass,
  onMessage,
  onChat,
}: MatchCardProps) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!onLike) return;
    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  // If it's a match card with bio and matchDate, render the match version
  if (bio && matchDate) {
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
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{name}, {age}</h3>
              <Badge variant="outline" className="text-xs">
                {matchDate}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          
          <p className="text-sm mb-3 line-clamp-2">{bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button 
            className="w-full"
            onClick={onChat}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Start chatting
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Otherwise render the original swipe card
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
          {onPass && (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full flex-1 border-red-200 hover:bg-red-50 hover:text-red-500"
              onClick={onPass}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          {onMessage && (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full flex-1 border-blue-200 hover:bg-blue-50 hover:text-blue-500"
              onClick={onMessage}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          )}
          {onLike && (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full flex-1 border-green-200 hover:bg-green-50 hover:text-green-500"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={`h-5 w-5 ${isLiking ? 'animate-pulse' : ''}`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
