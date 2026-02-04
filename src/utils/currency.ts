/**
 * Format a number as LKR currency
 * @param amount - The amount to format
 * @returns Formatted currency string with LKR symbol
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return `LKR 0.00`;
  }
  return `LKR ${amount.toFixed(2)}`;
}

/**
 * Currency symbol for Sri Lankan Rupee
 */
export const CURRENCY_SYMBOL = 'LKR';

/**
 * Free shipping threshold in LKR
 */
export const FREE_SHIPPING_THRESHOLD = 5000;