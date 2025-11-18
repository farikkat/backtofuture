/**
 * Speech Formatter Utility
 * Formats text for natural text-to-speech pronunciation
 */

/**
 * Format currency amounts for natural speech
 * Examples:
 *   "$29.99" → "twenty-nine dollars and ninety-nine cents"
 *   "$100.00" → "one hundred dollars"
 *   "$1,234.56" → "one thousand two hundred thirty-four dollars and fifty-six cents"
 * 
 * @param {string} text - Text containing currency amounts
 * @param {string} style - 'formal' (dollars and cents) or 'casual' (ninety-nine)
 * @returns {string} - Formatted text for speech
 */
function formatCurrencyForSpeech(text, style = 'casual') {
    if (!text) return text;
    
    // Match currency patterns: $1,234.56 or $99.99 or $50
    const currencyPattern = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    
    return text.replace(currencyPattern, (match, amount) => {
        // Remove commas for parsing
        const cleanAmount = amount.replace(/,/g, '');
        const [dollars, cents] = cleanAmount.split('.');
        
        const dollarAmount = parseInt(dollars, 10);
        const centAmount = cents ? parseInt(cents, 10) : 0;
        
        // Convert to words
        let result = '';
        
        // Dollars part
        if (dollarAmount === 0) {
            result = 'zero dollars';
        } else if (dollarAmount === 1) {
            result = 'one dollar';
        } else {
            result = `${numberToWords(dollarAmount)} dollars`;
        }
        
        // Cents part
        if (centAmount > 0) {
            if (style === 'formal') {
                // Formal: "and ninety-nine cents"
                result += ` and ${numberToWords(centAmount)} ${centAmount === 1 ? 'cent' : 'cents'}`;
            } else {
                // Casual: "ninety-nine" (like "twenty-nine ninety-nine")
                if (centAmount < 10) {
                    // Handle single digit cents: "oh five" for $29.05
                    result += ` oh ${numberToWords(centAmount)}`;
                } else {
                    result += ` ${numberToWords(centAmount)}`;
                }
            }
        }
        
        return result;
    });
}

/**
 * Convert number to words (up to 999,999)
 * @param {number} num - Number to convert
 * @returns {string} - Number in words
 */
function numberToWords(num) {
    if (num === 0) return 'zero';
    
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 
                   'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand'];
    
    function convertHundreds(n) {
        let result = '';
        
        // Hundreds place
        const hundred = Math.floor(n / 100);
        if (hundred > 0) {
            result += ones[hundred] + ' hundred';
            n %= 100;
            if (n > 0) result += ' ';
        }
        
        // Tens and ones place
        if (n >= 10 && n < 20) {
            result += teens[n - 10];
        } else {
            const ten = Math.floor(n / 10);
            const one = n % 10;
            
            if (ten > 0) {
                result += tens[ten];
                if (one > 0) result += '-';
            }
            
            if (one > 0) {
                result += ones[one];
            }
        }
        
        return result;
    }
    
    // Handle thousands
    if (num >= 1000) {
        const thousandPart = Math.floor(num / 1000);
        const remainder = num % 1000;
        
        let result = convertHundreds(thousandPart) + ' thousand';
        
        if (remainder > 0) {
            result += ' ' + convertHundreds(remainder);
        }
        
        return result;
    } else {
        return convertHundreds(num);
    }
}

/**
 * Format phone numbers for natural speech
 * Example: "800-555-1234" → "eight hundred, five five five, one two three four"
 * 
 * @param {string} text - Text containing phone numbers
 * @returns {string} - Formatted text for speech
 */
function formatPhoneForSpeech(text) {
    if (!text) return text;
    
    // Match phone number patterns
    const phonePattern = /(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})/g;
    
    return text.replace(phonePattern, (match, area, prefix, suffix) => {
        const areaWords = area.split('').map(d => numberToWords(parseInt(d, 10))).join(' ');
        const prefixWords = prefix.split('').map(d => numberToWords(parseInt(d, 10))).join(' ');
        const suffixWords = suffix.split('').map(d => numberToWords(parseInt(d, 10))).join(' ');
        
        return `${areaWords}, ${prefixWords}, ${suffixWords}`;
    });
}

/**
 * Format percentages for natural speech
 * Example: "15%" → "fifteen percent"
 * 
 * @param {string} text - Text containing percentages
 * @returns {string} - Formatted text for speech
 */
function formatPercentForSpeech(text) {
    if (!text) return text;
    
    const percentPattern = /(\d+(?:\.\d+)?)%/g;
    
    return text.replace(percentPattern, (match, number) => {
        const num = parseFloat(number);
        if (Number.isInteger(num)) {
            return `${numberToWords(num)} percent`;
        } else {
            const [whole, decimal] = number.split('.');
            return `${numberToWords(parseInt(whole, 10))} point ${decimal.split('').map(d => numberToWords(parseInt(d, 10))).join(' ')} percent`;
        }
    });
}

/**
 * Format dates for natural speech
 * Example: "11/06/2025" → "November sixth, twenty twenty-five"
 * 
 * @param {string} text - Text containing dates
 * @returns {string} - Formatted text for speech
 */
function formatDateForSpeech(text) {
    if (!text) return text;
    
    const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
                     'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 
                     'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth',
                     'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third',
                     'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh',
                     'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first'];
    
    return text.replace(datePattern, (match, month, day, year) => {
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10);
        
        const monthName = months[monthNum - 1] || month;
        const dayOrdinal = ordinals[dayNum] || day;
        
        // Format year: 2025 → "twenty twenty-five"
        let yearWords = '';
        if (yearNum >= 2000) {
            const thousands = Math.floor(yearNum / 1000);
            const remainder = yearNum % 1000;
            if (remainder === 0) {
                yearWords = numberToWords(thousands) + ' thousand';
            } else {
                const tens = Math.floor(remainder / 10);
                yearWords = `${numberToWords(thousands * 10)} ${numberToWords(tens)}`;
            }
        } else {
            yearWords = numberToWords(yearNum);
        }
        
        return `${monthName} ${dayOrdinal}, ${yearWords}`;
    });
}

/**
 * Remove asterisks from text (bullet points, emphasis markers)
 * @param {string} text - Text containing asterisks
 * @returns {string} - Text without asterisks
 */
function removeAsterisks(text) {
    if (!text) return text;
    
    // Remove single asterisks (emphasis markers)
    text = text.replace(/\*/g, '');
    
    // Clean up any double spaces created by removal
    text = text.replace(/\s{2,}/g, ' ');
    
    return text.trim();
}

/**
 * Replace slashes with "per" for natural speech
 * Example: "$29.99/month" → "$29.99 per month"
 * 
 * @param {string} text - Text containing slashes
 * @returns {string} - Text with "per" instead of "/"
 */
function replaceSlashesWithPer(text) {
    if (!text) return text;
    
    // Replace "/" with " per " but be careful of dates
    // Don't replace if it looks like a date pattern (e.g., "11/06/2025")
    text = text.replace(/(?<!\d)\/(?!\d{2}\/)/g, ' per ');
    
    // Common patterns like /month, /year, /day
    text = text.replace(/\/month/gi, ' per month');
    text = text.replace(/\/year/gi, ' per year');
    text = text.replace(/\/day/gi, ' per day');
    text = text.replace(/\/week/gi, ' per week');
    text = text.replace(/\/hr/gi, ' per hour');
    text = text.replace(/\/hour/gi, ' per hour');
    
    // Clean up any double spaces
    text = text.replace(/\s{2,}/g, ' ');
    
    return text.trim();
}

/**
 * Master formatter - applies all speech formatting rules
 * 
 * @param {string} text - Raw text from AI
 * @param {object} options - Formatting options
 * @param {string} options.currencyStyle - 'formal' or 'casual'
 * @returns {string} - Fully formatted text for speech
 */
function formatForSpeech(text, options = {}) {
    if (!text) return text;
    
    const { currencyStyle = 'casual' } = options;
    
    // Apply all formatters in sequence
    let formatted = text;
    
    // First, handle slashes before currency formatting (so "$29.99/month" becomes "$29.99 per month")
    formatted = replaceSlashesWithPer(formatted);
    
    // Then format currency, dates, percentages
    formatted = formatCurrencyForSpeech(formatted, currencyStyle);
    formatted = formatPercentForSpeech(formatted);
    formatted = formatDateForSpeech(formatted);
    
    // Remove asterisks last (after all other formatting)
    formatted = removeAsterisks(formatted);
    
    // Note: Phone formatting can be too verbose, enable if needed
    // formatted = formatPhoneForSpeech(formatted);
    
    return formatted;
}

module.exports = {
    formatForSpeech,
    formatCurrencyForSpeech,
    formatPhoneForSpeech,
    formatPercentForSpeech,
    formatDateForSpeech,
    removeAsterisks,
    replaceSlashesWithPer,
    numberToWords
};

