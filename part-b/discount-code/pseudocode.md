OUTPUT: On success returns {success: true, discountAmount: number in kobo rounded down, finalTotal: number in kobo}. On failure returns {success: false, error: failure name string}.


SIDE EFFECT: None: Because this is a pure function. it does not change anything outside itself and does not read anything outside itself and does not read anything outside itself like database or system clock, because timesUsedByCustomer and today are passed in as inputs. 


FAILS WHEN: INVALID_ORDER_TOTAL when orderTotal is not a whole number or is zero or less, CODE_NOT_FOUND when discountCode is null, INVALID_PERCENTAGE when discountCode.percentage is below 1 or above 100,  EXPIRED when today is after discountCode. expiresAt, TOO_MANY_USES when timesUsedByCustomer >= discountCode.  maxUsesPerCustomer, BELOW_MINIMUM_SPEND when orderTotal is below discountCode.  minimumSpend.


BOUNDARY DECISION: If today and expiresAt are the exact same moment, the code is still valid. it only becomes EXPIRED when today is strictly after expiresAt. 

FUNCTION applyDiscount(discountCode, orderTotal, today, timesUsedByCustomer): 
IF orderTotal is nt a whole number, or is zero or less, 
RETURN failure INVALID_ORDER_TOTAL 
OTHERWISE 
continue

2. IF discountCode is null 
RETURN failure CODE_NOT_FOUND
OTHERWISE
continue

3. IF discountCode.percentage is less than 1 or is greater than 100 
RETURN failure INVALID_PERCENTAGE 
OTHERWISE
continue

4. IF today is after
discountCode.expiresAt
RETURN failurebEXPIRED
OTHERWISE
continue


5. IF timesUsedByCustomer is greater
 than or equal to 
discountCode.maxUsesPerCustomer
RETURN failure TOO_MANY_USES
OTHERWISE 
continue

6. IF orderTotal is below 
discountCode.minimumSpend
RETURN failure BELOW_MINIMUM_SPEND
OTHERWISE
continue

7. COMPUTE discountAmount as 
FLOOR(orderTotal * discountCode.percentage /100) 
rounded down to nearest kobo

8. COMPUTE finaltotal as orderTotal
 minus discountAmount

9. RETURN success with discountAmount
and finalTotal
