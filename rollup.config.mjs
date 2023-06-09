import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "./src/three.js",
    output: [
      {
        format: "esm",
        file: "./dist/three-bundle.js",
      },
    ],
    plugins: [resolve()],
  },
  {
    input: "./src/wiv.js",
    output: [
      {
        format: "esm",
        file: "./dist/wiv-bundle.js",
      },
    ],
    plugins: [resolve()],
  },
  {
    input: "./src/wit.js",
    output: [
      {
        format: "esm",
        file: "./dist/wit-bundle.js",
      },
    ],
    plugins: [resolve()],
  },
  {
    input: './src/gltf.js',
    output: [
      {
        format: 'esm',
        file: './dist/gltf-bundle.js'
      },
    ],
    plugins: [
      resolve(),
    ]
  }
];
