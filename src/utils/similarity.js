import stringSimilarity from 'string-similarity';

export const checkSimilarity = (newReport, existingReports) => {
  // We use string-similarity to simulate an AI embeddings-based semantic search.
  // It computes the dice coefficient of two strings.
  
  if (!existingReports || existingReports.length === 0) return null;

  const newString = `${newReport.title || ''} ${newReport.category || ''} ${newReport.description || ''} ${newReport.location?.address || ''}`.toLowerCase();
  
  const matches = existingReports.map(report => {
    const existingString = `${report.title || ''} ${report.category || ''} ${report.description || ''} ${report.location?.address || ''}`.toLowerCase();
    
    // Dice's Coefficient (0.0 to 1.0)
    const score = stringSimilarity.compareTwoStrings(newString, existingString);
    
    return {
      report,
      score
    };
  });

  // Sort by highest score
  matches.sort((a, b) => b.score - a.score);
  
  const bestMatch = matches[0];
  
  // Define a threshold for "High Similarity" (e.g. 0.6+ is usually a strong semantic overlap for short text)
  if (bestMatch && bestMatch.score > 0.6) {
    return bestMatch;
  }
  
  return null;
};
