
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileInfoProps {
  bio: string;
  interests: string[];
  lookingFor: string;
  occupation?: string;
  education?: string;
}

const ProfileInfo = ({
  bio,
  interests,
  lookingFor,
  occupation,
  education
}: ProfileInfoProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {occupation && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Occupation</span>
              <span className="text-sm text-muted-foreground">{occupation}</span>
            </div>
          )}
          {education && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Education</span>
              <span className="text-sm text-muted-foreground">{education}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Looking For</span>
            <span className="text-sm text-muted-foreground">{lookingFor}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span 
                key={index} 
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
