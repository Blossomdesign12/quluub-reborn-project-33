
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { fieldNameToLabel, formatFieldValue, calculateAge, parseJsonField } from "@/utils/dataUtils";
import { Edit } from "lucide-react";

interface ProfileInfoProps {
  user: User;
  isCurrentUser: boolean;
  onEditClick?: () => void;
}

const BASIC_INFO_FIELDS = [
  'dob', 
  'nationality', 
  'country', 
  'region',
  'maritalStatus',
  'noOfChildren',
  'ethnicity',
];

const PHYSICAL_INFO_FIELDS = [
  'build',
  'appearance',
  'height',
  'weight',
  'genotype',
];

const RELIGIOUS_INFO_FIELDS = [
  'patternOfSalaah', 
  'revert',
  'startedPracticing',
  'sect',
  'scholarsSpeakers',
  'dressingCovering',
  'islamicPractice',
];

const OTHER_INFO_FIELDS = [
  'workEducation',
  'otherDetails',
  'traits',
  'openToMatches',
  'dealbreakers',
  'icebreakers',
];

const ProfileInfo = ({ user, isCurrentUser, onEditClick }: ProfileInfoProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Get the current age if DOB is available
  const age = user.dob ? calculateAge(user.dob) : null;

  const renderInfoSection = (fields: string[], allExpanded: boolean = false) => {
    return fields.map((field) => {
      const value = user[field as keyof User];
      if (value === undefined || value === null) return null;
      
      return (
        <div key={field} className="border-t py-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{fieldNameToLabel(field)}</span>
            <span className="text-sm font-medium">
              {formatFieldValue(value)}
            </span>
          </div>
        </div>
      );
    });
  };

  // Parse the wali details if they exist
  const waliDetails = user.waliDetails ? parseJsonField(user.waliDetails) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Summary</CardTitle>
          {isCurrentUser && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {user.summary ? (
            <p className="text-sm">{user.summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No summary provided</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Basic Information</CardTitle>
          {isCurrentUser && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-1">
          {user.kunya && (
            <div className="py-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kunya</span>
                <span className="text-sm font-medium">{user.kunya}</span>
              </div>
            </div>
          )}
          
          {age !== null && (
            <div className="py-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Age</span>
                <span className="text-sm font-medium">{age} years</span>
              </div>
            </div>
          )}
          
          {renderInfoSection(BASIC_INFO_FIELDS)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Physical Attributes</CardTitle>
          {isCurrentUser && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {renderInfoSection(PHYSICAL_INFO_FIELDS)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Religious Practice</CardTitle>
          {isCurrentUser && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {renderInfoSection(RELIGIOUS_INFO_FIELDS)}
        </CardContent>
      </Card>

      {waliDetails && Object.values(waliDetails).some(val => val) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Wali Information</CardTitle>
            {isCurrentUser && (
              <Button variant="ghost" size="sm" onClick={onEditClick}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {waliDetails.name && (
              <div className="border-t py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Wali Name</span>
                  <span className="text-sm font-medium">{waliDetails.name}</span>
                </div>
              </div>
            )}
            
            {waliDetails.email && (
              <div className="border-t py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Wali Email</span>
                  <span className="text-sm font-medium">{waliDetails.email}</span>
                </div>
              </div>
            )}
            
            {waliDetails.whatsapp && (
              <div className="border-t py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Wali WhatsApp</span>
                  <span className="text-sm font-medium">{waliDetails.whatsapp}</span>
                </div>
              </div>
            )}
            
            {waliDetails.telegram && (
              <div className="border-t py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Wali Telegram</span>
                  <span className="text-sm font-medium">{waliDetails.telegram}</span>
                </div>
              </div>
            )}
            
            {waliDetails.otherNumber && (
              <div className="border-t py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Wali Other Contact</span>
                  <span className="text-sm font-medium">{waliDetails.otherNumber}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Additional Information</CardTitle>
          {isCurrentUser && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {renderInfoSection(OTHER_INFO_FIELDS)}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
