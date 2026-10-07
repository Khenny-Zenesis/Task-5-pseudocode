type DiscountCode = {
    percentage: number;
    expiresAt: Date;
    minimumSpend: number;
    maxUsesPerCustomer: number;
};
type Result =
    | { success: true; discountAmount: number; finalTotal: number }
    | { success: false; error: string }

export function applyDiscount(
    discountCode: DiscountCode | null,
    orderTotal: number,
    today: Date,
    timesUsedByCustomer: number
): Result {
    // Step 1
    if (!Number.isInteger(orderTotal) || orderTotal <= 0) {
        return { success: false, error: "INVALID_ORDER_TOTAL" };
    }

    // Step 2: Check if code is null - MUST be before reading percentage
    if (discountCode === null) {
        return { success: false, error: "CODE_NOT_FOUND" };
    }

    // Step 3: Validate percentage 1-100
    if (discountCode.percentage < 1 || discountCode.percentage > 100) {
        return { success: false, error: "INVALID_PERCENTAGE" };
    }

    // Step 4: Check expiry - today after expiresAt = expired
    if (today > discountCode.expiresAt) {
        return { success: false, error: "EXPIRED" };
    }

    // Step 5: Check max uses per customer
    if (timesUsedByCustomer >= discountCode.maxUsesPerCustomer) {
        return { success: false, error: "TOO_MANY_USES" };
    }

    // Step 6: Check minimum spend
    if (orderTotal < discountCode.minimumSpend) {
        return { success: false, error: "BELOW_MINIMUM_SPEND" };
    }

    // Step 7: Compute discount with floor (round down)
    const discountAmount = Math.floor(orderTotal * discountCode.percentage / 100);

    // Step 8: Compute final total
    const finalTotal = orderTotal - discountAmount;

    // Step 9: Return success
    return { success: true, discountAmount, finalTotal };
}