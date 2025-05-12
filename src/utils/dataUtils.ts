
/**
 * Parse a JSON string safely
 * @param jsonString The string that might contain JSON
 * @returns Parsed object or array, or the original string if not valid JSON
 */
export const parseJsonField = (jsonString: string | null | undefined) => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // If not valid JSON, return the original string
    return jsonString;
  }
};

/**
 * Calculate age from a date of birth
 * @param dob Date of birth
 * @returns Age as a number or null if no valid date
 */
export const calculateAge = (dob: Date | string | undefined) => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format field values for display
 * @param value The field value
 * @returns Formatted value for display
 */
export const formatFieldValue = (value: any): string => {
  if (value === undefined || value === null) return 'Not specified';
  
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  
  if (value instanceof Date) return value.toLocaleDateString();
  
  if (typeof value === 'string') {
    // Try to parse as JSON
    const parsedValue = parseJsonField(value);
    if (Array.isArray(parsedValue)) {
      return parsedValue.join(', ');
    }
    if (parsedValue !== value) {
      // It's a parsed object
      return JSON.stringify(parsedValue);
    }
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
};

/**
 * Transform MongoDB/Mongoose field names to display labels
 * @param fieldName The database field name
 * @returns Human-readable label
 */
export const fieldNameToLabel = (fieldName: string): string => {
  // Special cases
  const specialCases: Record<string, string> = {
    'fname': 'First Name',
    'lname': 'Last Name',
    'dob': 'Date of Birth',
    'patternOfSalaah': 'Pattern of Salah',
    'waliDetails': 'Wali Details',
  };
  
  if (specialCases[fieldName]) {
    return specialCases[fieldName];
  }
  
  // General case: convert camelCase or snake_case to Title Case
  return fieldName
    // Add spaces between camelCase
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter
    .replace(/^./, str => str.toUpperCase());
};
