function ValidateExpression(str) {
  const stack = [];

  let pairs = 0;
  let maxDepth = 0;
  let currentDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === "(") {
      stack.push(i);

      currentDepth++;

      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
    }

    if (char === ")") {
      if (stack.length === 0) {
        return {
          valid: false,
          error: `Unexpected ")" at position ${i}`,
        };
      }

      stack.pop();
      currentDepth--;
      pairs++;
    }
  }

  if (stack.length > 0) {
    return {
      valid: false,
      error: `Missing ")" for "(" at position ${stack.pop()}`,
    };
  }

  const isMathExpression = /^[0-9+\-*/().^\s]+$/.test(str);

  if (!isMathExpression) {
    return {
      valid: false,
      error:
        "Expression contains invalid characters. Allowed: numbers, spaces, (), +, -, *, /, ^",
    };
  }

  const operators = (str.match(/[+\-*/^]/g) || []).length;

  return {
    valid: true,
    pairs,
    operators,
    maxDepth,
  };
}

function NormalizeExpression(str) {
  return str.replace(/\^/g, "**");
}

function Calculate(str) {
  const validation = ValidateExpression(str);

  if (!validation.valid) {
    return new Error(validation.error);
  }

  const normalizedExpression = NormalizeExpression(str);

  try {
    const result = Function(`"use strict"; return (${normalizedExpression})`)();

    return {
      expression: str,
      normalizedExpression,
      result,
      pairs: validation.pairs,
      operators: validation.operators,
      maxDepth: validation.maxDepth,
    };
  } catch (error) {
    return new Error(`Unable to calculate expression: ${error.message}`);
  }
}

/* ---------------- TESTS ---------------- */

console.log(Calculate("((5 + 2) * (8 - 3))"));

console.log(Calculate("2^3 + (10 / 2)"));

console.log(Calculate("((((5))))"));

// console.log(Calculate("(10 + 5))"));

// console.log(Calculate("10 + abc"));
