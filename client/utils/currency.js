// map ISO code → unicode symbol
export const currencySymbolMap = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CNY: "¥",
    INR: "₹",
    // …add more as you need
  };
  
  // map ISO code → Ionicons icon name (if available)
  export const currencyIconMap = {
    USD: "logo-usd",
    EUR: "logo-euro",
    GBP: "logo-pound",
    JPY: "logo-yen",
    // A$, C$ etc. aren’t in Ionicons by default—those will simply fall back to the unicode symbol
  };
  
  /**
   * Returns a Unicode symbol (e.g. "$", "€") for a currency code,
   * or the raw code string if there’s no mapping.
   */
  export function getCurrencySymbol(code) {
    if (!code) return "";
    const upper = code.toUpperCase();
    return currencySymbolMap[upper] || upper;
  }
  
  /**
   * Returns an Ionicons icon name (e.g. "logo-usd") if available,
   * otherwise undefined.
   */
  export function getCurrencyIconName(code) {
    if (!code) return;
    return currencyIconMap[code.toUpperCase()];
  }
  