# Task 5: Pseudocoding

This repo holds my work for the Task 5 pseudocoding assessment.
Pseudocode here means a plain-English description of a function precise
enough that someone who has never seen the code can predict what it does.

## Structure

- part-a/ — reading and describing existing code
  - a1-own-functions/ — three functions from my own projects
    (computeProration, getOwnedRecord, the signup handler), each with
    pseudocode, hand traces, and a real run that matched
  - a2-open-source/ — three functions from the cors library
    (isString, configureMethods, isOriginAllowed)
  - a3-planted-bug/ — a function with a planted bug, found with a
    failing test and fixed (see its README)
- part-b/discount-code/ — a feature I specified before building:
  notes, pseudocode, five hand traces, and my own TypeScript version, run-traces.ts, and real output.
- part-c/ — the same pseudocode given to an AI to build, compared with
  my version

## Status

- A1: done (pseudocode, hand traces, and real runs for all three functions)
- A2: done (my first attempts, my final versions, and a comparison)
- A3: done (bug found, fixed, and proven with a failing and a passing run)
- B: done (notes, pseudocode, five traces, my own TypeScript; all five real outputs matched my predictions)
- C: done (AI-built version and written comparison)

## How I used AI

I used an AI assistant (Claude) throughout, as a reviewer and tutor, and a
second AI (OpenCode, DeepSeek V4 Flash) for the Part C build. Where each
part came from:

- **A1:** The assistant suggested which functions to use, and I supplied
  the real code from my own projects. It drafted the pseudocode and the
  hand-trace predictions from that code. I checked them against my
  reading, ran the real code myself, and every real output matched.
- **A2:** My first attempts at the cors functions are in the file exactly
  as I wrote them, after the assistant explained how pseudocode works with
  an unrelated example. When I got stuck, it taught the ideas with small
  questions and drafted pseudocode for comparison. I then wrote my own
  final versions and my own comparison. The assistant pointed out one
  mistake (I had dropped the object return in configureMethods) and I
  fixed it.
- **A3:** The assistant planted the bug in a copy of my Async Standup
  route. I found the cause with guided questions: I compared the test's
  error string with the string the route checks and saw the lowercase "i."
  I proved it with a failing and a passing test run and wrote the
  explanation. The assistant tightened the wording.
- **Part B:** The assistant suggested the discount-code feature. The
  decisions were mine, reached by answering guided questions: the checks,
  inputs, output, rounding, check order, and boundaries. The assistant
  corrected a few of my mistakes (the rounding wording, and putting the
  null check before the percentage check). I wrote the numbered steps and
  the five traces, and steps 3 to 9 of my TypeScript. Step 1, step 2,
  the type definitions, and the function signature came from a skeleton
  and editor help. The assistant also wrote the runner script, polished
  the formatting of traces.md, and drafted notes.md from our
  conversation.
- **Part C:** OpenCode built its version from pseudocode.md only, in a
  separate empty folder, using an instruction the assistant helped me
  write. I ran it and wrote comparison.md. The assistant also ran both
  versions side by side on extra inputs and pointed out differences,
  which I checked against the code.