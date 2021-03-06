import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";

// Common.
const input = "./src/index.ts";
const extensions = [".js", ".jsx", ".ts", ".tsx"];

// Babel options.
const getBabelOptions = ({ useESModules }) => ({
  exclude: "node_modules/**",
  extensions,
  runtimeHelpers: true,
  plugins: [["@babel/transform-runtime", { useESModules }]]
});

export default [
  // Universal module definition (UMD) build
  {
    input,
    output: {
      file: "dist/muuri-react.js",
      format: "umd",
      name: "MuuriReact",
      globals: { react: "React", muuri: "Muuri" }
    },
    external: ["react", "muuri"],
    plugins: [
      babel(getBabelOptions({ useESModules: true })),
      resolve({ extensions }),
      commonjs({
        include: "node_modules/**"
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify("development") })
    ]
  },

  // Minified UMD build
  {
    input,
    output: {
      file: "dist/muuri-react.min.js",
      format: "umd",
      name: "MuuriReact",
      globals: { react: "React", muuri: "Muuri" }
    },
    external: ["react", "muuri"],
    plugins: [
      babel(getBabelOptions({ useESModules: true })),
      resolve({ extensions }),
      commonjs({
        include: "node_modules/**"
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      terser()
    ]
  },

  // CommonJS (cjs) build
  // - All external packages are not bundled
  {
    input,
    output: { file: pkg.main, format: "cjs" },
    external: (id) => !id.startsWith(".") && !id.startsWith("/"),
    plugins: [
      resolve({ extensions }),
      babel(getBabelOptions({ useESModules: false }))
    ]
  },

  // EcmaScript Module (esm) build
  // - All external packages are not bundled
  {
    input,
    output: { file: pkg.module, format: "esm" },
    external: (id) => !id.startsWith(".") && !id.startsWith("/"),
    plugins: [
      resolve({ extensions }),
      babel(getBabelOptions({ useESModules: true }))
    ]
  }
];
