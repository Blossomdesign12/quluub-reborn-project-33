
// Utility functions for data handling and formatting

// Parse JSON stored as string
export const parseJsonField = (jsonString: string | undefined | null): any => {
  if (!jsonString) return null;
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

// Format field values for display
export const formatFieldValue = (value: any, fieldName: string): string => {
  if (value === undefined || value === null) return "Not provided";
  
  // Date formatting
  if (fieldName === 'dob' || fieldName === 'startedPracticing') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  }
  
  // Boolean formatting
  if (typeof value === 'boolean') {
    return value ? "Yes" : "No";
  }
  
  return String(value);
};

// Convert camelCase field names to readable labels
export const fieldNameToLabel = (fieldName: string): string => {
  // Handle special cases
  if (fieldName === 'dob') return 'Date of Birth';
  if (fieldName === 'fname') return 'First Name';
  if (fieldName === 'lname') return 'Last Name';
  
  // Convert camelCase to Title Case with spaces
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Format time ago
export const timeAgo = (date: Date | string): string => {
  const now = new Date();
  const pastDate = typeof date === 'string' ? new Date(date) : date;
  const secondsAgo = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return 'Just now';
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
  }
  
  // For older dates, return formatted date
  return pastDate.toLocaleDateString();
};
