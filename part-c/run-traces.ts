import { applyDiscount } from "./discount-ai";

const SAVE10 = {
    percentage: 10,
    expiresAt: new Date("2026-12-31"),
    minimumSpend: 200000,
    maxUsesPerCustomer: 2,
};
const day = (s: string) => new Date(s);

console.log("Trace 1", applyDiscount(SAVE10, 500000, day("2026-10-07"), 0));
console.log("Trace 2", applyDiscount(SAVE10, 200001, day("2026-10-07"), 0));
console.log("Trace 3", applyDiscount(SAVE10, 200000, day("2026-12-31"), 1));
console.log("Trace 4", applyDiscount(null, 500000, day("2026-10-07"), 0));
console.log("Trace 5", applyDiscount(SAVE10, 150000, day("2026-10-07"), 0));