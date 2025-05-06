
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfilePhotosProps {
  photos: string[];
  editable?: boolean;
}

const ProfilePhotos = ({ photos, editable = false }: ProfilePhotosProps) => {
  // Mock handler for photo click in edit mode
  const handlePhotoClick = (index: number) => {
    if (editable) {
      console.log(`Clicked photo at index ${index}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={cn(
                "aspect-square rounded-md overflow-hidden cursor-pointer",
                editable && "hover:opacity-80 transition-opacity"
              )}
              onClick={() => handlePhotoClick(index)}
            >
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {editable && photos.length < 6 && (
            <div 
              className="aspect-square rounded-md border-2 border-dashed border-muted flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => console.log("Add photo")}
            >
              <span className="text-2xl text-muted-foreground">+</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePhotos;
