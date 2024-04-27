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
const Revit = {
	input: "worker/Revit/RevitWorker.ts",
	output: {
		file: "src/bimModel/components/src/Worker/RevitWorker.js",
		format: "esm",
	},
	plugins: plugins
}

// This creates the bundle used by the examples
export default [Revit];
