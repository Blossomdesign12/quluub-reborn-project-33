
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const ProfileImage = ({ 
  src, 
  alt, 
  fallback, 
  size = "md", 
  className 
}: ProfileImageProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src || ""} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileImage;
