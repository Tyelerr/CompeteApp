export const getCurrentTimezone =(): string => {
  // Use Intl.DateTimeFormat().resolvedOptions().timeZone
  // This returns the IANA timezone identifier (e.g., "Europe/Berlin", "America/Los_Angeles")
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}



export function CapitalizeWords(text: string) {
  // Check if the input is a valid string
  if (typeof text !== 'string' || text === null || text === undefined) {
    console.warn("Input must be a string. Returning empty string.");
    return "";
  }

  // Handle empty string case
  if (text.trim() === "") {
    return "";
  }

  // Split the string into an array of words based on spaces
  // Using a regular expression /\s+/ to handle multiple spaces between words
  const words = text.split(/\s+/);

  // Map over each word to capitalize its first letter
  const capitalizedWords = words.map(word => {
    // If the word is empty (e.g., from multiple spaces), return it as is
    if (word.length === 0) {
      return "";
    }
    // Capitalize the first letter and concatenate with the rest of the word (in lowercase)
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // console.log('capitalizedWords:', capitalizedWords);

  // Join the capitalized words back into a single string with single spaces
  return capitalizedWords.join(" ");
}