/**
 * ESLint custom rule to prevent hard-coded colors
 * Enforces using CSS variables from global.css instead of hard-coded color values
 */

const hardcodedColorPatterns = [
  // Hex colors - match valid hex color patterns, but exclude URL fragments
  // This regex ensures we only match hex colors in color contexts, not URLs
  /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?/,
  // RGB/RGBA colors
  /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/,
  // HSL/HSLA colors (but allow hsl(var(--variable)) pattern)
  /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%/,
];

// Common Tailwind color patterns to flag
const tailwindColorPatterns = [
  // bg-{color}-{shade}
  /bg-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/,
  // text-{color}-{shade}
  /text-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/,
  // border-{color}-{shade}
  /border-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/,
  // from-{color}-{shade}, to-{color}-{shade}, via-{color}-{shade for gradients
  /(from|to|via)-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/,
];

// Allowed color patterns (using CSS variables)
const allowedPatterns = [
  // hsl(var(--variable))
  /hsl\(var\(--[\w-]+\)/,
  // CSS custom properties
  /var\(--[\w-]+\)/,
  // Tailwind semantic colors
  /\b(bg|text|border|from|to|via)-(background|foreground|primary|secondary|accent|muted|destructive|warning|success|card|popover|input|ring|chart-[1-5])(-foreground)?\b/,
];

function isAllowedColorUsage(value) {
  return allowedPatterns.some(pattern => pattern.test(value));
}

function hasHardcodedColor(value) {
  // First check if it's an allowed pattern
  if (isAllowedColorUsage(value)) {
    return false;
  }

  // Exclude URL fragments and other non-color contexts
  if (isUrlFragment(value)) {
    return false;
  }

  // Check for hard-coded color patterns
  return (
    hardcodedColorPatterns.some(pattern => pattern.test(value)) ||
    tailwindColorPatterns.some(pattern => pattern.test(value))
  );
}

function isUrlFragment(value) {
  // Check if the value looks like a URL fragment/anchor
  // URL fragments typically start with # followed by letters, numbers, hyphens, underscores
  return /^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(value);
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hard-coded colors, enforce using CSS variables from global.css",
      category: "Best Practices",
    },
    fixable: null,
    schema: [],
    messages: {
      hardcodedColor:
        "Hard-coded color detected: '{{ value }}'. Use CSS variables from global.css instead (e.g., bg-primary, text-foreground, hsl(var(--primary))).",
      hardcodedTailwind:
        "Hard-coded Tailwind color detected: '{{ value }}'. Use semantic colors from global.css instead (e.g., bg-primary, bg-secondary, bg-accent).",
    },
  },
  create(context) {
    function checkStringForHardcodedColors(node, value) {
      if (typeof value !== "string") return;

      if (hasHardcodedColor(value)) {
        // Determine if it's a Tailwind color or raw color
        const isTailwindColor = tailwindColorPatterns.some(pattern =>
          pattern.test(value)
        );
        const messageId = isTailwindColor
          ? "hardcodedTailwind"
          : "hardcodedColor";

        context.report({
          node,
          messageId,
          data: { value },
        });
      }
    }

    return {
      // Check JSX className attributes
      JSXAttribute(node) {
        if (node.name.name === "className" && node.value) {
          if (node.value.type === "Literal") {
            checkStringForHardcodedColors(node, node.value.value);
          } else if (
            node.value.type === "JSXExpressionContainer" &&
            node.value.expression.type === "Literal"
          ) {
            checkStringForHardcodedColors(node, node.value.expression.value);
          } else if (
            node.value.type === "JSXExpressionContainer" &&
            node.value.expression.type === "TemplateLiteral"
          ) {
            // Handle template literals in className
            node.value.expression.quasis.forEach(quasi => {
              checkStringForHardcodedColors(node, quasi.value.raw);
            });
          }
        }
      },

      // Check style attributes and CSS-in-JS
      JSXAttribute(node) {
        if (node.name.name === "style" && node.value) {
          if (
            node.value.type === "JSXExpressionContainer" &&
            node.value.expression.type === "ObjectExpression"
          ) {
            node.value.expression.properties.forEach(prop => {
              if (prop.type === "Property" && prop.value.type === "Literal") {
                checkStringForHardcodedColors(node, prop.value.value);
              }
            });
          }
        }
      },

      // Check string literals in general (catches CSS-in-JS and other color usage)
      Literal(node) {
        if (typeof node.value === "string" && node.parent) {
          // Only check if it looks like it might contain colors
          if (
            /color|background|border|bg-|text-|#[0-9a-fA-F]|rgb|hsl/.test(
              node.value
            )
          ) {
            checkStringForHardcodedColors(node, node.value);
          }
        }
      },

      // Check template literals for color patterns
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          if (
            /color|background|border|bg-|text-|#[0-9a-fA-F]|rgb|hsl/.test(
              quasi.value.raw
            )
          ) {
            checkStringForHardcodedColors(node, quasi.value.raw);
          }
        });
      },
    };
  },
};
