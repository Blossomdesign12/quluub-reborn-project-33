
// Function to convert field names to readable labels
export const fieldNameToLabel = (field: string): string => {
  const labelMap: Record<string, string> = {
    dob: "Date of Birth",
    fname: "First Name",
    lname: "Last Name",
    kunya: "Kunya/Nickname",
    nationality: "Nationality",
    country: "Country",
    region: "Region",
    build: "Build",
    appearance: "Appearance",
    height: "Height",
    weight: "Weight",
    maritalStatus: "Marital Status",
    noOfChildren: "Children",
    ethnicity: "Ethnicity",
    patternOfSalaah: "Pattern of Salaah",
    revert: "Revert",
    startedPracticing: "Started Practicing",
    sect: "Sect",
    scholarsSpeakers: "Scholars/Speakers",
    dressingCovering: "Dressing/Covering",
    islamicPractice: "Islamic Practice",
    genotype: "Genotype",
    workEducation: "Work & Education",
    otherDetails: "Other Details",
    traits: "Traits",
    openToMatches: "Open To Matches",
    dealbreakers: "Dealbreakers",
    icebreakers: "Icebreakers",
  };

  return labelMap[field] || field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
};

// Format field values for display
export const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string") {
    // Try to parse JSON string
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      } else if (typeof parsed === "object" && parsed !== null) {
        return Object.values(parsed).filter(Boolean).join(", ");
      }
      return String(parsed);
    } catch (e) {
      // Not valid JSON, return as is
      return value;
    }
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
};

// Calculate age from date of birth
export const calculateAge = (dob: Date | string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Parse JSON strings safely
export const parseJsonField = (jsonString: string | null | undefined): any => {
  if (!jsonString) return null;
  
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString;
  }
};

// Format time ago from date
export const timeAgo = (date: string | Date): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  
  // If it's today, only show the time
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], options);
  }
  
  // If it's within the last week
  if (diffInSeconds < 604800) {
    return messageDate.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
           messageDate.toLocaleTimeString([], options);
  }
  
  // For older messages
  return messageDate.toLocaleDateString();
};
