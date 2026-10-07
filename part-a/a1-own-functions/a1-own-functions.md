# A1: Three Functions From My Own Projects

Each function: pseudocode, three hand-traced inputs (normal, edge, invalid),
and the result of running the real code with the same inputs.

**Authorship note (be honest in the README):** the pseudocode below was
drafted with an AI assistant, and I confirmed it matched my reading of the
real code before running it. The traces were predicted before the real
runs, and every real run matched.

Where the real code lives:
- computeProration: Provly Billing Slice (`lib/payments/proration.ts`), test file `trace-test.ts`
- getOwnedRecord: Provly Records/Access Slice (`lib/records/queries.ts`), test file `trace-test-records.ts`
- signup handler: Provly Auth Slice (`app/api/auth/signup/route.ts`), test file `trace-test-signup.ts`

Copy those three `trace-test` files into this folder as evidence.

---

## 1. computeProration (money)

```
FUNCTION computeProration
INPUTS:
  currentPeriodStart — Date — when the current billing period began
  currentPeriodEnd — Date — when the current billing period ends
  asOf — Date — the moment we're calculating from (usually right now)
  currentPriceMinor — number — full price of the plan currently being paid, in minor units (e.g. kobo)
  targetPriceMinor — number — full price of the new plan being switched to, in minor units
OUTPUT: an object containing daysInPeriod, daysRemaining, creditMinor, targetPriceMinor, and amountDueMinor
SIDE EFFECTS: NONE
FAILS WHEN: never explicitly fails — always returns a result, even for unusual inputs

1. Calculate the total number of days in the current period, by finding the difference between currentPeriodEnd and currentPeriodStart, converting to days, and rounding to the nearest whole day.
2. IF that calculated number of days is less than 1
     Use 1 instead (never divide by zero later)
3. Calculate the raw number of days remaining, by finding the difference between currentPeriodEnd and asOf, converting to days (not yet rounded).
4. Round that raw remaining number UP to the nearest whole day.
5. IF the rounded remaining days is negative
     Use 0 instead (can't have negative days remaining)
6. IF the rounded remaining days is more than the total days in the period
     Cap it at the total days in the period (can't have more remaining than the period itself)
7. Calculate the credit: take the fraction of the period still remaining (days remaining divided by total days), multiply by the current price, and round to the nearest whole number.
8. Calculate the amount due: subtract the credit from the target plan's full price.
9. IF that amount due is negative
     Use 0 instead (never charge a negative amount, never auto-refund here)
10. RETURN an object with all five calculated values.
```

### Traces (SAVE: monthly 300000 kobo to yearly 3000000 kobo)

| Trace | Inputs | Predicted | Real output |
|---|---|---|---|
| 1 Normal | start Jan 1, end Feb 1, asOf Jan 1 | 31 days, 31 remaining, credit 300000, due 2700000 | daysInPeriod 31, daysRemaining 31, creditMinor 300000, amountDueMinor 2700000 (match) |
| 2 Edge | same, asOf Feb 1 | 31 days, 0 remaining, credit 0, due 3000000 | daysInPeriod 31, daysRemaining 0, creditMinor 0, amountDueMinor 3000000 (match) |
| 3 Invalid | start Feb 1, end Jan 1 (swapped), asOf Jan 15 | day count clamped to 1, no crash | daysInPeriod 1, daysRemaining 0, creditMinor 0, amountDueMinor 3000000 (match) |

Note: my prediction for Trace 3 was loose ("a small, weird but valid
number"). The real run showed the exact values above. The step 2 clamp is
what stopped a crash.

---

## 2. getOwnedRecord (authorization)

```
FUNCTION getOwnedRecord
INPUTS:
  userId — string — the ID of the currently signed-in user
  publicId — string — the ID of the record being requested
OUTPUT: the record's data (title, notes, status, timestamps) if found and owned by this user, otherwise null
SIDE EFFECTS: NONE (read-only)
FAILS WHEN: never throws — returns null for both "doesn't exist" and "exists but belongs to someone else"

1. Query the database for one record where BOTH the userId matches the given userId AND the publicId matches the given publicId, selecting only the specific fields needed (publicId, title, notes, status, createdAt, updatedAt).
2. RETURN whatever the query finds — either the matching record, or null if nothing matched both conditions at once.
```

### Traces

| Trace | Inputs | Predicted | Real output |
|---|---|---|---|
| 1 Normal | user A asks for a record A owns | the record is returned | the record (title "Test Record Owned By A", status OPEN) (match) |
| 2 Edge | user B asks for A's real record | null | null (match) |
| 3 Invalid | user A asks for a made-up ID | null | null (match) |

Key point: cases 2 and 3 give the same answer on purpose, so a stranger
cannot tell a record that exists from one that doesn't.

---

## 3. Signup handler (error handling)

```
FUNCTION POST (signup handler)
INPUTS: request — an HTTP request containing name, email, password in its body
OUTPUT: an HTTP response, one of: 201 (new account created), 200 (existing incomplete account, code reissued), 200 (duplicate race, idempotent success), 409 (already verified), 400 (invalid input), 429 (rate limited), 500 (unexpected error)
SIDE EFFECTS: may write a new User row, may write a VerificationCode row, may log a code to the console
FAILS WHEN: input fails validation, too many signup attempts from this IP recently, or an unexpected database error occurs

1. Read and parse the request body as JSON. IF parsing fails, treat the body as invalid (null).
2. Validate the body against the signup schema (name, email, password all present and correctly shaped).
   IF invalid
     RETURN 400 with the specific validation errors
3. CALL the rate limiter, keyed on the requester's IP address, checking against SIGNUP_LIMIT (5) within SIGNUP_WINDOW_MS (15 minutes).
   IF the rate limit is exceeded
     RETURN 429, including a Retry-After header telling the caller how long to wait
4. Look up whether a user with this email already exists in the database.
5. IF a user with this email already exists
     IF that existing user's email is already verified
       RETURN 409 — "already registered, please sign in instead"
     OTHERWISE (exists, but not yet verified)
       Issue a fresh verification code for that existing user
       RETURN 200 — "account exists but isn't verified, here's a new code" (include the actual code in the response ONLY if not running in production)
6. OTHERWISE (genuinely no existing user with this email)
   Hash the given password
   WRITE a new User record with the given email, name, and hashed password
   Issue a verification code for this new user
   RETURN 201 — "account created" (include the actual code in the response ONLY if not running in production)
7. IF, during any of the above, the database throws an error
     IF that error is specifically a P2002 (unique constraint violation on email — meaning two near-simultaneous requests both tried to create the same account)
       RETURN 200 — treat this race condition as an idempotent success, same as if the account already existed
     OTHERWISE (a genuinely unexpected error)
       Log the real error internally
       RETURN 500 — a generic, non-revealing error message
```

### Traces

| Trace | Inputs | Predicted | Real output |
|---|---|---|---|
| 1 Normal | a brand-new email | 201, account created | status 201, ok true, verified false, "Account created. Check your email for the verification code." (match) |
| 2 Edge | an email that exists and is already verified | 409, told to sign in | status 409, "This email is already registered. Please sign in instead." (match) |
| 3 Invalid | body with no password | 400, validation error | status 400, "Invalid input", errors: password "Password is required" (match) |

Note: Trace 2 is the fix for a real bug I found earlier: a verified user
signing up again used to be offered a new code instead of being told they
were already registered.