# Part C: AI Build and Comparison

## Setup
Built with OpenCode using DeepSeek V4 Flash, from pseudocode.md only, in a separate empty folder. The AI could not see my own discount.ts.
Instruction given: "Implement this function exactly as the pseudocode describes, in TypeScript, in one file. Do not add checks or features that aren't in the pseudocode. Use the same function name, inputs, and error names. If anything in the pseudocode is unclear, list your assumption in a comment instead of guessing silently"
OpenCode named its file applyDiscount.ts; I renamed it to discount-ai.ts.
Only change to its code: added "export". The version of pseudocode used was the final one from part-b after fixing the check order. That version did NOT have a separate INPUTS block; inputs were only listed in the FUNCTION applyDiscount(...) line.

## Do the outputs match?
Yes. All five traces match: my predictions in traces.md, my own function’s output, and the AI’s output in ai-output.txt.

## What differs in the code?
Check order is same (INVALID_ORDER_TOTAL, CODE_NOT_FOUND, INVALID_PERCENTAGE, EXPIRED, TOO_MANY_USES, BELOW_MINIMUM_SPEND) and floor rounding same. Difference: AI uses today.getTime() > expiresAt.getTime(), I use today > expiresAt. Both work for Dates. AI types error as union of six names, I use plain string. AI has stricter typing. The AI’s function was not exported, and my pseudocode never said to export it, so I added export.

## What the AI added
AI added four assumption comments at top as my prompt requested, about: shape of discountCode object, comparing today and expiresAt as Dates with boundary, using Number.isInteger for whole number so NaN fails, and number being whole kobo floored. It also added stricter types . It added no extra validation checks.

## What my pseudocode left open
My pseudocode does say INVALID_PERCENTAGE below 1 or above 100, but left open that percentage must be a whole number and a real number, so 10.5 and NaN get through. It also left open invalid dates and that money should be whole kobo, and it never said to export the function, so the AI did not  add it.

## What I would change in the pseudocode
I would add one sentence to clarify whole number. New sentence: "Percentage must be an actual number and whole number using Number.isInteger, so 10.5 and NaN return { success: false, error: INVALID_PERCENTAGE }." This keeps returning failure objects, not throwing, as my OUTPUT defines.