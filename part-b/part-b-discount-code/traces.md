# Part B: Five Hand Traces

All traces use this sample code, SAVE10:

- percentage: 10
- expiresAt: 2026-12-31
- minimumSpend: 200000 kobo
- maxUsesPerCustomer: 2

Each trace shows my prediction first. The "Actual output" line is filled
in after I run discount.ts with the same inputs.

---

## Trace 1: A normal success (comfortably above the minimum)
**Inputs:** discountCode = SAVE10, orderTotal = 500000 kobo,
today = 2026-10-07, timesUsedByCustomer = 0

**Steps:** passes step 1 (orderTotal valid), step 2 (code not null),
step 3 (10% valid), step 4 (2026-10-07 is not after 2026-12-31),
step 5 (0 < 2), step 6 (500000 >= 200000). Reaches step 9.

**Math:** discountAmount = FLOOR(500000 * 10 / 100) = FLOOR(50000) = 50000
finalTotal = 500000 - 50000 = 450000

**Predicted result:** { success: true, discountAmount: 50000, finalTotal: 450000 }
**Actual output:** { success: true, discountAmount: 50000, finalTotal: 450000 }

---

## Trace 2: A rounding case (10% is not a whole number of kobo)
**Inputs:** discountCode = SAVE10, orderTotal = 200001 kobo,
today = 2026-10-07, timesUsedByCustomer = 0

**Steps:** passes steps 1 to 6. Reaches step 9.

**Math:** 200001 * 10 = 2000010, / 100 = 20000.1, FLOOR = 20000
discountAmount = 20000, finalTotal = 200001 - 20000 = 180001
This shows the discount is rounded down.

**Predicted result:** { success: true, discountAmount: 20000, finalTotal: 180001 }
**Actual output:** { success: true, discountAmount: 20000, finalTotal: 180001 }

---

## Trace 3: Boundaries (today equals expiresAt, and total equals the minimum)
**Inputs:** discountCode = SAVE10, orderTotal = 200000 kobo (exactly
the minimum), today = 2026-12-31 (exactly expiresAt),
timesUsedByCustomer = 1

**Steps:** passes steps 1 to 6 (step 5: 1 < 2). Reaches step 9.
Boundary decision: the code is still valid at the exact expiry moment,
and it is EXPIRED only when today is strictly after expiresAt.
An order equal to the minimum is allowed because step 6 checks
"below", not "at or below".

**Math:** discountAmount = FLOOR(200000 * 10 / 100) = 20000
finalTotal = 200000 - 20000 = 180000

**Predicted result:** { success: true, discountAmount: 20000, finalTotal: 180000 }
**Actual output:** { success: true, discountAmount: 20000, finalTotal: 180000 }

---

## Trace 4: A failure that stops early (null code)
**Inputs:** discountCode = null, orderTotal = 500000 kobo,
today = 2026-10-07, timesUsedByCustomer = 0

**Steps:** step 1 passes. Step 2 finds discountCode is null and returns.
Steps 3 to 6 never run, so nothing tries to read the percentage of a
null code.

**Predicted result:** { success: false, error: "CODE_NOT_FOUND" }
**Actual output:** { success: false, error: 'CODE_NOT_FOUND' }

---

## Trace 5: A failure that stops late (fails at step 6)
**Inputs:** discountCode = SAVE10, orderTotal = 150000 kobo
(below the 200000 minimum), today = 2026-10-07,
timesUsedByCustomer = 0

**Steps:** steps 1 to 5 pass (150000 is valid, code not null, 10% valid,
not expired, 0 < 2). Step 6 finds 150000 < 200000 and returns.

**Predicted result:** { success: false, error: "BELOW_MINIMUM_SPEND" }
**Actual output:** { success: false, error: 'BELOW_MINIMUM_SPEND' }