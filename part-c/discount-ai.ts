
// Exact output from OpenCode (DeepSeek V4 Flash); only change: added "export".
// Assumptions (where the pseudocode was unclear):
// 1. discountCode is a plain object with fields: percentage (number),
//    expiresAt (Date), maxUsesPerCustomer (number), minimumSpend (number).
// 2. today and expiresAt are Date objects; "after" is compared by timestamp.
//    Same timestamp is NOT after, so the code is still valid (matches the
//    BOUNDARY DECISION).
// 3. "not a whole number" is checked with Number.isInteger, so NaN and
//    non-integers both fail INVALID_ORDER_TOTAL.
// 4. All money values are integers in kobo; the result of the percentage
//    computation is floored to the nearest whole kobo.

type DiscountCode = {
    percentage: number;
    expiresAt: Date;
    maxUsesPerCustomer: number;
    minimumSpend: number;
};

type ApplyDiscountSuccess = {
    success: true;
    discountAmount: number;
    finalTotal: number;
};

type ApplyDiscountFailure = {
    success: false;
    error:
    | "INVALID_ORDER_TOTAL"
    | "CODE_NOT_FOUND"
    | "INVALID_PERCENTAGE"
    | "EXPIRED"
    | "TOO_MANY_USES"
    | "BELOW_MINIMUM_SPEND";
};

type ApplyDiscountResult = ApplyDiscountSuccess | ApplyDiscountFailure;

export function applyDiscount(
    discountCode: DiscountCode | null,
    orderTotal: number,
    today: Date,
    timesUsedByCustomer: number,
): ApplyDiscountResult {
    if (!Number.isInteger(orderTotal) || orderTotal <= 0) {
        return { success: false, error: "INVALID_ORDER_TOTAL" };
    }

    if (discountCode === null) {
        return { success: false, error: "CODE_NOT_FOUND" };
    }

    if (discountCode.percentage < 1 || discountCode.percentage > 100) {
        return { success: false, error: "INVALID_PERCENTAGE" };
    }

    if (today.getTime() > discountCode.expiresAt.getTime()) {
        return { success: false, error: "EXPIRED" };
    }

    if (timesUsedByCustomer >= discountCode.maxUsesPerCustomer) {
        return { success: false, error: "TOO_MANY_USES" };
    }

    if (orderTotal < discountCode.minimumSpend) {
        return { success: false, error: "BELOW_MINIMUM_SPEND" };
    }

    const discountAmount = Math.floor(
        (orderTotal * discountCode.percentage) / 100,
    );
    const finalTotal = orderTotal - discountAmount;

    return { success: true, discountAmount, finalTotal };
}
