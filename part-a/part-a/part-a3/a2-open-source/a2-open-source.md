# A2: Three Functions From an Open-Source Library (cors)

Source: `node_modules/cors/lib/index.js`, read from my e-commerce project.
The three functions: isString (short), configureMethods (medium),
isOriginAllowed (hard, recursive).

**Honest status:** the brief wants my own first-pass pseudocode, then an AI's
explanation of the same functions, then a comparison. I wrote first-pass
attempts for all three (below, exactly as I wrote them). They were rough.
After I got stuck, I learned the ideas by working through small questions
with an AI assistant. The finished pseudocode in section 2 was drafted by
the assistant. **To do before submitting:** write my own final version of
each in my own words (section 3) and finish the comparison (section 4).

---

## 1. My first-pass attempts (verbatim, before any help with the pseudocode)

**isString**
> function is string
> if it is an instance string then return it is true
> if not then retutn false

**configureMethods**
> function configureMethods(option)
> if methods. join exist then set option.methods to joined with comma.
> returned it to "Access-Control-Allow-Methods"
> valve=methods.

**isOriginAllowed**
> function isoriginallowed
> if allowedorin is an array then from [0] is false
> if allowedorigin [i] is true then return true and end it if return false

---

## 2. AI-drafted pseudocode (the comparison side)

```
FUNCTION isString
INPUTS: s — a value of any type
OUTPUT: true or false
SIDE EFFECTS: NONE
FAILS WHEN: never

1. IF s is a plain text string
     RETURN true
   OTHERWISE
     RETURN false
```

```
FUNCTION configureMethods
INPUTS: options — an object containing a methods field, which may be an array or a string
OUTPUT: an object with key "Access-Control-Allow-Methods" and value equal to the methods as one string
SIDE EFFECTS: NONE
FAILS WHEN: never

1. Take the methods value from options.
2. IF methods is an array
     Join it into one comma-separated string
   OTHERWISE
     Leave it as-is
3. RETURN an object pairing the header name with that string
```

```
FUNCTION isOriginAllowed
INPUTS:
  origin — string — the actual origin making the request (e.g. "b.com")
  allowedOrigin — an array, a string, a RegExp, or a boolean — the rule(s) defining what's allowed
OUTPUT: true or false
SIDE EFFECTS: NONE
FAILS WHEN: never — always returns true or false

1. IF allowedOrigin is a list (an array of multiple allowed origins)
     FOR EACH item in that list
       CALL isOriginAllowed again, using the same origin and this one item as the new allowedOrigin
       IF that call returns true
         RETURN true immediately (one match anywhere in the list is enough)
     END FOR
     RETURN false (nothing in the whole list matched)
2. OTHERWISE, IF allowedOrigin is a plain text string
     RETURN true only if origin exactly equals allowedOrigin, otherwise false
3. OTHERWISE, IF allowedOrigin is a pattern (a RegExp)
     RETURN true only if origin matches that pattern, otherwise false
4. OTHERWISE (allowedOrigin is something else, like a plain boolean)
     RETURN allowedOrigin converted directly to true or false
```

Worked example I traced by hand: allowedOrigin = ["a.com", "b.com"],
origin = "b.com". "a.com" does not match, "b.com" does, so the function
returns true. A plain `true` falls to the last branch and gives true.

---


FUNCTION isString
INPUTS: s -- any value that might be a string
OUTPUT: boolean true if it is a string,  false if not 
SIDE EFFECTS: none
FAILS WHEN: never fails, always returns true or false

1. check if s is a string in two ways and return true if either is true:
first check if typeof s === 'string' which catches a normal piece of text that is a string like "hello", or second check if s is an instance of string a text object, like new String("hello"). if neither is  true, return false.

FUNCTION configureMethods(methods)
INPUTS: methods - can be an array of strings, or a strings like ['GET', 'POST',] or a single string like "GET,POST" 
OUTPUT: string - a single comma- seperated string of methods
SIDE EFFECTS: none
FAILS WHEN: never fails
1. Check what type methods is. If it is an array, join all the items in the array with a comma to make one string and return it. If it is already a string, return it as it is without joining. The check exists because methods can arrive as an array or as a string, and only an array needs joining to become a header value.

FUNCTION isOriginAllowed(origin, allowedOrigin) 
INPUTS: origin - the request origin string, allowedOrigin - can be an array, a string, a RegExp, or anything else like boolean OUTPUT: boolean - true if origin is allowed, false if not
SIDE EFFECTS: none
FAILS WHEN: never fails
1. If allowedOrigin is an array, loop through each item in the array and call isOriginAllowed on that single item with the origin. If any call returns true, return true immediately, otherwise return false after the loop. This recursion is useful because an allowed list can contain a mix of strings and RegExps, so calling itself reuses the same string and RegExp logic instead of writing it twice.
2. If allowedOrigin is a string, return true only if origin === allowedOrigin (exact match).
3. If allowedOrigin is a RegExp, return true if the RegExp test matches origin, like allowedOrigin.test(origin).
4. For anything else (boolean, etc.), return true if allowedOrigin is truthy and false if it is falsy, using !!allowedOrigin.

## 4. Comparison 

My first attempt said "instance of string" which was half right. The real code checks two ways: typeof s === 'string' for a normal text like "hello", and s instanceof String for an object-wrapped text like new String("hello"). My final version names both checks and says what each one catches. The AI version said only "a plain text string" and left out the object-wrapped case, so mine is more complete there.
configureMethods
My first attempt got the join right and that the result goes under the header name. What I missed was why the check exists. The real code checks if (methods.join) because methods can already be a string like "GET,POST", so only arrays need joining. If it is already a string, it leaves it as-is. I also wrote "valve" when I meant "value" in my first attempt. The real function returns an object with key: 'Access-Control-Allow-Methods' and value: methods, not just a string. My final version says that.
isOriginAllowed
My first attempt got the loop right: going through a list and stopping at the first match. What I missed was everything else. The function calls itself on each list item - that is recursion. It also has a string branch that checks exact match, a pattern branch that checks RegExp with test(), and a boolean branch that returns!!allowedOrigin. I also missed the final false when nothing in the list matched. The AI version listed those branches, but it did not explain why recursion is used.

Questions to answer in my own words:

Which first-pass miss surprised me most?
The isOriginAllowed boolean and RegExp branches surprised me most, because I thought allowedOrigin would only be a string or an array. The real code shows it can be a RegExp or boolean too, and for boolean it just returns true or false. That makes it more flexible than I expected.

Where did my reading differ from the AI's, and who was right?
For isString, I said "instance" and AI said "plain text". We were both half right, but the real code is right: it checks both typeof and instanceof, so my final combined version is more correct than AI alone. For configureMethods, AI said it returns a string, but going back to the real cors code, it actually returns an object with string as a value. So i  was wrong there and AI was right after checking the code

What is recursion here, and why is it useful?
Recursion means the function calls itself inside its own code. In isOriginAllowed, when allowedOrigin is an array, it loops and calls isOriginAllowed(origin, allowedOrigin[i]) for each item. This is useful because the list can contain mixed types - some strings, some RegExps, some booleans. Instead of writing separate checks for each type inside the loop, it reuses the same string, RegExp, and boolean logic by calling itself.