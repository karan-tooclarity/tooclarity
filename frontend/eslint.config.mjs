import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const isProduction = process.env.NODE_ENV === "production";

const eslintConfig = [
  {
    ignores: [
      "src/app/test/**",
      "src/test/**",
      "src/components/auth/testComponents/**",
      "src/components/test/**",
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // 🔹 Allow console.log in dev, warn in production (warn only)
      "no-console": [
        isProduction ? "warn" : "off",
        { allow: ["warn", "error"] },
      ],

      // 🔹 TypeScript cleanup
      "@typescript-eslint/no-explicit-any": "warn", // warn, don’t fail build
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // 🔹 Next.js image optimization rule (warn only)
      "@next/next/no-img-element": "warn",

      // 🔹 React Hooks & import stability
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-unresolved": "off",
      "import/extensions": "off",
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;