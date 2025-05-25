import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/shared.cjs", format: "cjs" },
    { file: "dist/shared.mjs", format: "es" },
  ],
  plugins: [resolve(), commonjs()],
  external: ["react"],
};
