import { format } from 'date-fns';

/**
 * Returns a new Date object representing the current time.
 */
export const getNow = () => new Date();

/**
 * Formats a Date object or ISO string in the user's local timezone.
 * @param {Date|string} date - The date to format
 * @param {string} formatStr - The date-fns format string (e.g. 'yyyy-MM-dd')
 * @returns {string} The formatted date string
 */
export const formatLocal = (date, formatStr) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, formatStr);
};

/**
 * Native Intl formatting for local timezone.
 * @param {Date|string} date 
 * @param {Intl.DateTimeFormatOptions} options 
 * @returns {string}
 */
export const getLocalString = (date, options = {}) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', options);
};
