/**
 * Represents a discount code.
 */
export interface DiscountCode {
  /**
   * The code of the discount.
   */
  code: string;
  /**
   * The discount percentage.
   */
  discountPercentage: number;
}

/**
 * Asynchronously retrieves discount details for a given discount code.
 *
 * @param code The discount code to retrieve.
 * @returns A promise that resolves to a DiscountCode object containing the discount details.
 */
export async function getDiscountCode(code: string): Promise<DiscountCode | null> {
  // TODO: Implement this by calling an API.

  if (code === 'SAMPLE') {
    return {
      code: 'SAMPLE',
      discountPercentage: 10,
    };
  }

  return null;
}
