import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/package.cjs", format: "cjs" },
    { file: "dist/package.mjs", format: "es" },
  ],
  plugins: [resolve(), commonjs()],
  external: [],
};
