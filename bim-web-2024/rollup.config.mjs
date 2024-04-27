import { nodeResolve } from "@rollup/plugin-node-resolve";
import extensions from './rollup-extensions.mjs';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

const plugins = [
	extensions({
		extensions: ['.js'],
	}),
	nodeResolve(),
	commonjs(),
	json(),
	typescript({
		tsconfig: 'tsconfig.rollup.json'
	})
]
const worker1 = {
	input: "worker/worker1.ts",
	output: {
		file: "src/bimModel/components/src/Worker/worker1.js",
		format: "esm",
	},
	plugins: plugins
}
const worker2 = {
	input: "worker/worker2.ts",
	output: {
		file: "src/bimModel/components/src/Worker/worker2.js",
		format: "esm",
	},
	plugins: plugins
}
// This creates the bundle used by the examples
export default [worker1, worker2];
