import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The 3D scenes mutate three.js objects and overlay DOM nodes inside the
  // render loop (useFrame) on purpose — that is how R3F avoids re-rendering
  // React 60 times a second — so the compiler-purity rules do not apply there.
  {
    files: ["src/three/**"],
    rules: { "react-hooks/immutability": "off", "react-hooks/refs": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
