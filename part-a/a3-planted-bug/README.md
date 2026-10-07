# A3: Planted Bug

## What the function actually did
For an unknown but well-formed invite code, the RPC returned the error
"Invalid invite code." The route checks that message with
includes("invalid invite code"). Because the check is lowercase and
case-sensitive, it did not match, so the route returned 500
"Something went wrong" instead.

## What it should do
Return 404 with "Invalid invite code. No team found." The 500 branch
should only run for real, unexpected server errors.

## The bug
The route's message check uses lowercase "invalid", but the error text
starts with a capital "Invalid", and .includes() is case-sensitive, so
the 404 branch never runs.

## How I found it
The 404 test failed with Expected 404 and Received 500. I compared the
test's error string with the string the route checks and saw the
different "i".

## Impact
A valid code works fine, since only the failure path is broken, so the
bug stays hidden unless someone tests a bad code. A user would see
"something went wrong" and might retry when the real problem is a
wrong code.

## How to prevent it
Match on an error code instead of message text, or compare in
lowercase, so a one-letter difference cannot break the check.

## Evidence
- failing-output.txt: 1 failed, 16 passed
- passing-output.txt: 17 passed
- buggy-version.ts and fixed-version.ts: differ only at line 58
