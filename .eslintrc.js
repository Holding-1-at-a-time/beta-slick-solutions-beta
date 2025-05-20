module.exports = {
  extends: ["next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "import"],
  parser: "@typescript-eslint/parser",
  rules: {
    // Enforce named exports for components
    "import/no-default-export": "warn",
    "import/prefer-default-export": "off",

    // Allow default exports in specific Next.js files
    "import/no-anonymous-default-export": "error",

    // Enforce consistent export patterns
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
      },
    ],

    // Prevent usage of 'any' type
    "@typescript-eslint/no-explicit-any": "error",

    // Enforce consistent import ordering
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "object", "type"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    // Special rule for Next.js pages and layouts
    "next-export-pattern/enforce": "off", // Custom rule placeholder
  },
  overrides: [
    // Allow default exports in Next.js pages and layouts
    {
      files: [
        "app/**/page.tsx",
        "app/**/layout.tsx",
        "app/**/loading.tsx",
        "app/**/error.tsx",
        "pages/**/*.tsx",
        "middleware.ts",
        "next.config.js",
        "tailwind.config.js",
        "postcss.config.js",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
    // Enforce both named and default exports for components
    {
      files: ["components/**/*.tsx"],
      rules: {
        "import/no-default-export": "off",
        "import/no-anonymous-default-export": "error",
      },
    },
  ],
}
