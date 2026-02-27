/**
 * A local, regex-based Natural Language Understanding (NLU) engine specifically 
 * designed for extracting protein amounts and food labels from spoken text.
 * 
 * Example inputs: 
 * - "I drank Chocolate Milkshake with 26g of protein" -> { amount: 26, label: "Chocolate Milkshake" }
 * - "Chocolate Milkshake 26 grams" -> { amount: 26, label: "Chocolate Milkshake" }
 * - "40g chicken breast" -> { amount: 40, label: "chicken breast" }
 */
export function parseSpokenProteinEntry(text) {
    if (!text || typeof text !== 'string') return null;

    const normalizedText = text.toLowerCase().trim();

    // Regex breakdown:
    // (\d+(?:\.\d+)?) -> Captures numbers (integers or decimals)
    // \s* -> Optional space
    // (?:g|grams?|gram)\b -> Non-capturing group for keywords: g, gram, grams
    const amountRegex = /(\d+(?:\.\d+)?)\s*(?:g|grams?|gram)\b/i;

    const amountMatch = normalizedText.match(amountRegex);

    if (!amountMatch) {
        // Fallback: If no "g" or "grams" is found, let's just see if there's *any* lone number
        // that makes sense as an amount (e.g. "chicken 30")
        const fallbackNumberRegex = /\b(\d+(?:\.\d+)?)\b/;
        const fallbackMatch = normalizedText.match(fallbackNumberRegex);

        if (!fallbackMatch) return null; // Couldn't find any numbers

        const amount = parseFloat(fallbackMatch[1]);
        const label = extractLabel(text, fallbackMatch[0]);
        return { amount, label };
    }

    const amount = parseFloat(amountMatch[1]);
    // The full string matched e.g., "26g" or "26 grams"
    const matchedAmountString = amountMatch[0];

    const label = extractLabel(text, matchedAmountString);

    return { amount, label };
}

// Helper to clean up the rest of the sentence into a readable food label
function extractLabel(originalText, stringToRemove) {
    let label = originalText
        .replace(new RegExp(stringToRemove, 'i'), '') // Remove the "26g" part
        .replace(/\b(i ate|i had|i drank|with|of protein)\b/gi, '') // Remove filler voice words
        .trim();

    // Clean up extra spaces and punctuation left behind
    label = label.replace(/\s{2,}/g, ' ').replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim();

    // Capitalize first letter beautifully
    if (label.length > 0) {
        label = label.charAt(0).toUpperCase() + label.slice(1);
    } else {
        label = "Voice Entry"; // Ultimate fallback if they just said "30g"
    }

    return label;
}
