# Part B: Discount Code Notes

## 1. What I'd check at a shop counter
- Is the code real? (I first described scanning the code to confirm it.)
- Is the customer eligible, like a regular customer?
- Has it expired?
- Has this customer used it too many times?
- Has the code been used by too many customers overall?

## 2. What I kept and what I cut
To keep the function small, I dropped the "regular customer" rule and the
overall usage limit. I kept four checks: code exists, not expired, order
meets the minimum spend, and the customer is under their usage limit.
I also added checks for bad input: the order total and the percentage.

## 3. Inputs and why
- discountCode: an object, or null if the code doesn't exist. It holds
  percentage, expiresAt, minimumSpend, and maxUsesPerCustomer.
  If it's null there is nothing to read, so the function stops.
- orderTotal: whole number in kobo (e.g. 500000 for ₦5,000, since
  5,000 x 100 = 500,000). Whole numbers avoid errors.
- today: a Date passed in, so the function never reads the clock.
- timesUsedByCustomer: a whole number passed in. I chose to pass it in
  instead of looking it up, to keep the function small and pure.
- percentage is a whole number (10 means 10%) because it is easier to read
  and matches what the shop displays.
- Dates are Date objects, not strings, so they compare directly.

## 4. Output
- Success: discountAmount and finalTotal, both whole numbers in kobo.
- Failure: success false plus the name of the failed check, so the caller
  can show the customer the right message.

## 5. Rounding
I round the discount down with Math.floor, so the store never gives more
discount than the percentage. I multiply first and then divide by 100,
then floor, then subtract from the order total.
(I first wrote "round up" and corrected it, because rounding up gives the
customer extra.)

## 6. Failure names and check order
Order: INVALID_ORDER_TOTAL, CODE_NOT_FOUND, INVALID_PERCENTAGE, EXPIRED,
TOO_MANY_USES, BELOW_MINIMUM_SPEND.

Why this order:
- Bad inputs come first, because nothing after them can be trusted.
- The code must exist before I read its percentage. [Review feedback:
  I had first put the percentage check before the null check, which would
  crash on a null code. I moved CODE_NOT_FOUND ahead of it.]
- Expired and too many uses come before the minimum spend, because the
  customer can't fix those. The minimum spend comes last because the
  customer can fix it by adding items. [A hint from the review pointed me
  to this idea, and I chose the final placement.]

## 7. Boundary decisions
- If today equals expiresAt exactly, the code is still valid. It expires
  only when today is strictly after expiresAt.
- An order total exactly equal to the minimum spend is allowed, because
  the check is "below," not "at or below."