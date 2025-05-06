
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProfileData {
  name: string;
  age: number;
  location: string;
  photoUrl: string;
  bio: string;
  faith: {
    practice: string;
    prayFiveTimes: boolean;
    hijab: string;
    sect: string;
    converted: boolean;
    important: string;
  };
  personal: {
    ethnicity: string;
    languages: string[];
    maritalStatus: string;
    hasChildren: boolean;
    wantsChildren: string;
    education: string;
    occupation: string;
    relocate: string;
  };
  appearance: {
    height: string;
    build: string;
    hijabStyle: string;
  };
  lifestyle: {
    smoke: string;
    drink: string;
    diet: string;
    exercise: string;
  };
  interests: string[];
}

interface ProfileEditFormProps {
  profileData: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
  onCancel: () => void;
}

const ProfileEditForm = ({ profileData, onSave, onCancel }: ProfileEditFormProps) => {
  const [profile, setProfile] = useState<ProfileData>({...profileData});
  const { toast } = useToast();
  const [newInterest, setNewInterest] = useState("");

  const handleChange = (field: string, value: string | number | boolean) => {
    const fields = field.split(".");
    
    if (fields.length === 1) {
      setProfile({
        ...profile,
        [fields[0]]: value
      });
    } else if (fields.length === 2) {
      // Fix for the TypeScript error - We need to handle each specific property correctly
      const category = fields[0] as keyof ProfileData;
      const property = fields[1];
      
      // Create a properly typed update based on the specific category
      if (category === 'faith') {
        setProfile({
          ...profile,
          faith: {
            ...profile.faith,
            [property]: value
          }
        });
      } else if (category === 'personal') {
        setProfile({
          ...profile,
          personal: {
            ...profile.personal,
            [property]: value
          }
        });
      } else if (category === 'appearance') {
        setProfile({
          ...profile,
          appearance: {
            ...profile.appearance,
            [property]: value
          }
        });
      } else if (category === 'lifestyle') {
        setProfile({
          ...profile,
          lifestyle: {
            ...profile.lifestyle,
            [property]: value
          }
        });
      }
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(i => i !== interest)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to an API
    onSave(profile);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={profile.age}
              onChange={(e) => handleChange("age", parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photoUrl">Profile Photo URL</Label>
            <Input
              id="photoUrl"
              value={profile.photoUrl}
              onChange={(e) => handleChange("photoUrl", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">About Me</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
          />
        </div>
        
        <h3 className="text-lg font-medium pt-4">Faith & Religious Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="practice">Religious Practice</Label>
            <Select 
              value={profile.faith.practice} 
              onValueChange={(value) => handleChange("faith.practice", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select practice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very Practicing">Very Practicing</SelectItem>
                <SelectItem value="Practicing">Practicing</SelectItem>
                <SelectItem value="Moderately Practicing">Moderately Practicing</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prayFiveTimes">Pray Five Times</Label>
            <Select 
              value={profile.faith.prayFiveTimes ? "yes" : "no"} 
              onValueChange={(value) => handleChange("faith.prayFiveTimes", value === "yes")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hijab">Wear Hijab</Label>
            <Select 
              value={profile.faith.hijab} 
              onValueChange={(value) => handleChange("faith.hijab", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Always">Always</SelectItem>
                <SelectItem value="Sometimes">Sometimes</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sect">Religious Sect</Label>
            <Select 
              value={profile.faith.sect} 
              onValueChange={(value) => handleChange("faith.sect", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sunni">Sunni</SelectItem>
                <SelectItem value="Shia">Shia</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <h3 className="text-lg font-medium pt-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Ethnicity</Label>
            <Input
              id="ethnicity"
              value={profile.personal.ethnicity}
              onChange={(e) => handleChange("personal.ethnicity", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select 
              value={profile.personal.maritalStatus} 
              onValueChange={(value) => handleChange("personal.maritalStatus", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Never Married">Never Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={profile.personal.education}
              onChange={(e) => handleChange("personal.education", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={profile.personal.occupation}
              onChange={(e) => handleChange("personal.occupation", e.target.value)}
            />
          </div>
        </div>
        
        <h3 className="text-lg font-medium pt-4">Interests</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <div 
                key={index} 
                className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="text-primary/70 hover:text-primary focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add a new interest"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddInterest}
              disabled={!newInterest.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
