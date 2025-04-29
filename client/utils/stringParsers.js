
/**
 * Summarize an array of Google Places opening_hours strings.
 * @param {string[]} hoursArray
 * @returns {string}
 */
export function summarizeOpeningHours(hoursArray) {
    if (!Array.isArray(hoursArray) || hoursArray.length === 0) {
      return 'Opening hours not available';
    }
  
    const allHours = hoursArray.join(' ').toLowerCase();
    if (allHours.includes('open 24 hours')) {
      return 'Open 24 Hours';
    }
  
    const weekdayHours = [];
    const weekendHours = [];
    hoursArray.forEach((entry) => {
      const lower = entry.toLowerCase();
      if (/(monday|tuesday|wednesday|thursday|friday)/.test(lower)) {
        weekdayHours.push(entry);
      } else if (/(saturday|sunday)/.test(lower)) {
        weekendHours.push(entry);
      }
    });
  
    const summarizeGroup = (group) => {
      if (group.length === 0) return null;
      const times = group
        .map(day => day.split(': ')[1])
        .filter(Boolean);
      const unique = [...new Set(times)];
      return unique.length === 1 ? unique[0] : 'Various hours';
    };
  
    const weekdaySummary = summarizeGroup(weekdayHours);
    const weekendSummary = summarizeGroup(weekendHours);
    let summary = '';
  
    if (weekdaySummary) summary += `Weekdays: ${weekdaySummary}`;
    if (weekendSummary) {
      if (summary) summary += ' | ';
      summary += `Weekend: ${weekendSummary}`;
    }
  
    return summary || 'See Details';
  }
  
  /**
   * Turn numeric Google Places price_level into a human‑friendly string.
   * @param {number} priceLevel
   * @returns {string}
   */
  export function parsePriceLevel(priceLevel) {
    if (priceLevel === undefined || priceLevel === null) {
      return 'Price info not available';
    }
    switch (priceLevel) {
      case 0: return 'Free';
      case 1: return 'Inexpensive';
      case 2: return 'Moderate';
      case 3: return 'Expensive';
      case 4: return 'Very Expensive';
      default: return 'N/A';
    }
  }

  /**
 * Get today's opening hours from an array of Google Places opening_hours strings.
 * @param {string[]} hoursArray
 * @returns {string} e.g. "8:00 AM – 5:00 PM", "Closed", or a fallback message
 */
export function getTodayOpeningHours(hoursArray) {
    if (!Array.isArray(hoursArray) || hoursArray.length === 0) {
      return 'Opening hours not available';
    }
  
    // Determine today's weekday name, e.g. "Monday"
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    // Find the line starting with "Monday:", etc.
    const todayLine = hoursArray.find(line => line.startsWith(todayName + ':'));
  
    if (!todayLine) {
      return 'N/A';
    }
  
    // Split on the first colon and space, the remainder is the times or "Closed"
    const parts = todayLine.split(/: (.+)/);
    // parts[1] holds the string after the first ": "
    return parts[1] || '';
  }

  /**
 * Convert an array of Google Places `types` into a string of styled hashtags.
 * E.g. ['restaurant','bar'] → '#Restaurant #Bar'
 *
 * @param {string[]} typesArray
 * @param {number} [limit]  max number of tags to show (default 3)
 * @returns {string}
 */
export function parseTypesToHashtags(typesArray, limit = 3) {
  if (!Array.isArray(typesArray) || typesArray.length === 0) {
    return '';
  }
  // Utility to capitalize each word
  const capitalize = str =>
    str
      .split(/[_\s-]+/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join('');

  // Take at most `limit` types
  return typesArray
    .slice(0, limit)
    .map(type => `#${capitalize(type)}`)
    .join(' ');
}

/**
 * Determine whether a place is currently open.
 * @param {string[]} hoursArray  Google Places weekday_text, e.g.
 *   ["Monday: 7:00 AM – 9:00 PM", …]
 * @returns {"Open" | false | "N/A"}
 */
export function getOpeningStatus(hoursArray) {
  if (!Array.isArray(hoursArray) || hoursArray.length === 0) {
    return "N/A";
  }

  // Find today's entry, e.g. "Wednesday: 8:00 AM – 5:00 PM"
  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const todayLine = hoursArray.find((line) =>
    line.startsWith(todayName + ":")
  );
  if (!todayLine) {
    return "N/A";
  }

  const timesPart = todayLine.split(/: (.+)/)[1]; // after the first ": "
  if (!timesPart) {
    return "N/A";
  }
  const lower = timesPart.toLowerCase();
  if (lower.includes("open 24")) {
    return "Open";
  }
  if (lower.includes("closed")) {
    return false;
  }

  // Parse "7:30 AM – 9:00 PM" into [startMin, endMin]
  const [startStr, endStr] = timesPart.split("–").map((s) => s.trim());
  const parseToMinutes = (t) => {
    // Normalize weird spaces
    const clean = t.replace(/\u202F/g, " ").replace(/\s+/g, " ");
    const [time, modifier] = clean.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (modifier.toLowerCase() === "pm" && h < 12) h += 12;
    if (modifier.toLowerCase() === "am" && h === 12) h = 0;
    return h * 60 + (m || 0);
  };

  let startMin, endMin;
  try {
    startMin = parseToMinutes(startStr);
    endMin = parseToMinutes(endStr);
  } catch {
    return "N/A";
  }

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  if (startMin <= nowMin && nowMin <= endMin) {
    return "Open";
  }
  return false;
}
