OUTPUT: On success returns {success: true, discountAmount: number in kobo rounded down, finalTotal: number in kobo}. On failure returns {success: false, error: failure name string}.



SIDE EFFECT: None: Because this is a pure function. it does not change anything outside itself and does not read anything outside itself and does not read anything outside itself like database or system clock, because timesUsedByCustomer and today are passed in as inputs.



FAILS WHEN: INVALID\_ORDER\_TOTAL when orderTotal is not a whole number or is zero or less, CODE\_NOT\_FOUND when discountCode is null, INVALID\_PERCENTAGE when discountCode.percentage is below 1 or above 100,  EXPIRED when today is after discountCode. expiresAt, TOO\_MANY\_USES when timesUsedByCustomer >= discountCode.  maxUsesPerCustomer, BELOW\_MINIMUM\_SPEND when orderTotal is below discountCode.  minimumSpend.



BOUNDARY DECISION: If today and expiresAt are the exact same moment, the code is still valid. it only becomes EXPIRED when today is strictly after expiresAt.

FUNCTION applyDiscount(discountCode, orderTotal, today, timesUsedByCustomer):
IF orderTotal is not a whole number, or is zero or less,
RETURN failure INVALID\_ORDER\_TOTAL
OTHERWISE
continue

2. IF discountCode is null
RETURN failure CODE\_NOT\_FOUND
OTHERWISE
continue
3. IF discountCode.percentage is less than 1 or is greater than 100
RETURN failure INVALID\_PERCENTAGE
OTHERWISE
continue
4. IF today is after
discountCode.expiresAt
RETURN failure EXPIRED
OTHERWISE
continue



1. IF timesUsedByCustomer is greater
than or equal to
discountCode.maxUsesPerCustomer
RETURN failure TOO\_MANY\_USES
OTHERWISE
continue
2. IF orderTotal is below
discountCode.minimumSpend
RETURN failure BELOW\_MINIMUM\_SPEND
OTHERWISE
continue
3. COMPUTE discountAmount as
FLOOR(orderTotal \* discountCode.percentage /100)
rounded down to nearest kobo
4. COMPUTE finaltotal as orderTotal
minus discountAmount
5. RETURN success with discountAmount
and finalTotal

