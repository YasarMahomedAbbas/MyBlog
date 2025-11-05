/**
 * ESLint rule to enforce using logger instead of console methods
 * @fileoverview Disallow console.log and other console methods, suggest using logger instead
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "disallow console methods, use logger instead",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null, // Disable auto-fix to prevent import issues
    schema: [],
    messages: {
      noConsoleLog: "Use logger.{{method}}() instead of console.{{method}}()",
      noConsoleError: "Use logger.error() instead of console.error()",
      noConsoleWarn: "Use logger.warn() instead of console.warn()",
      noConsoleInfo: "Use logger.info() instead of console.info()",
      noConsoleDebug: "Use logger.debug() instead of console.debug()",
    },
  },

  create(context) {
    const consoleMethods = new Set(["log", "error", "warn", "info", "debug"]);

    const loggerMethodMap = {
      log: "info",
      error: "error",
      warn: "warn",
      info: "info",
      debug: "debug",
    };

    return {
      MemberExpression(node) {
        if (
          node.object &&
          node.object.type === "Identifier" &&
          node.object.name === "console" &&
          node.property &&
          node.property.type === "Identifier" &&
          consoleMethods.has(node.property.name)
        ) {
          const consoleMethod = node.property.name;
          const loggerMethod = loggerMethodMap[consoleMethod];

          context.report({
            node,
            messageId: `noConsole${consoleMethod.charAt(0).toUpperCase() + consoleMethod.slice(1)}`,
            data: {
              method: loggerMethod,
            },
          });
        }
      },
    };
  },
};
