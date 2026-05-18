function robustParseDays(daysInput) {
  if (!daysInput) return [];
  
  // If it's already an array, return it
  if (Array.isArray(daysInput)) {
    return daysInput;
  }
  
  if (typeof daysInput !== 'string') {
    return [];
  }
  
  let cleaned = daysInput.trim();
  
  // Try direct parse first
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // If parsed is a string (e.g. double-stringified), continue parsing
    if (typeof parsed === 'string') {
      return robustParseDays(parsed);
    }
  } catch (e) {
    // Direct parse failed, continue with heuristics
  }
  
  // Handle the n8n weird case: starts with '["' and has escaped quotes, but doesn't end with '"]'
  if (cleaned.startsWith('["')) {
    cleaned = '[' + cleaned.substring(2);
  }
  if (cleaned.endsWith('"]')) {
    cleaned = cleaned.substring(0, cleaned.length - 2) + ']';
  }
  
  // Replace escaped quotes
  cleaned = cleaned.replace(/\\"/g, '"');
  
  // Also replace any double-escaped or triple-escaped quotes if they exist
  cleaned = cleaned.replace(/\\\\"/g, '"');
  
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (typeof parsed === 'string') {
      return robustParseDays(parsed);
    }
  } catch (e) {
    console.error('Robust parse failed for:', cleaned.substring(0, 100), e.message);
  }
  
  return [];
}

// Tests
console.log('Test 1 (array):', robustParseDays([{ day: 1 }]));
console.log('Test 2 (clean stringified):', robustParseDays('[{"day": 2}]'));
console.log('Test 3 (double stringified):', robustParseDays('"[{\\"day\\": 3}]"'));
console.log('Test 4 (corrupted n8n string):', robustParseDays('["{\\"day\\": 4, \\"activities\\": []}, {\\"day\\": 5}]'));
