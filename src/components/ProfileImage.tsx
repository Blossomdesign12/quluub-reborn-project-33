
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const ProfileImage = ({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: ProfileImageProps) => {
  // Size classes mapping
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  // Modify fallback text based on size
  const getFallback = () => {
    if (size === "xs" || size === "sm") {
      return fallback.charAt(0);
    }
    return fallback.length > 2 ? fallback.substring(0, 2) : fallback;
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src || ""} alt={alt} />
      <AvatarFallback>{getFallback()}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileImage;
