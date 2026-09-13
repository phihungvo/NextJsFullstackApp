import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "separate-type-imports", prefer: "type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "no-duplicate-imports": "error",
    },
  },
  {
    files: ["**/*.client.{js,mjs,cjs,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/headers",
              message: "Server-only modules must not be imported by Client Components.",
            },
            {
              name: "next/server",
              message: "Server-only modules must not be imported by Client Components.",
            },
          ],
          patterns: [
            {
              group: ["@/server/**", "@/lib/db/**", "@/lib/redis/**"],
              message: "Server-only modules must not be imported by Client Components.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
