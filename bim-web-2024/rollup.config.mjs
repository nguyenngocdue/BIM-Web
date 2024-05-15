import { nodeResolve } from "@rollup/plugin-node-resolve";
import extensions from './rollup-extensions.mjs';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import copy from 'rollup-plugin-copy'

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
	plugins: [...plugins, copy({
		targets: [
			{ src: 'worker/Revit/RevitType.ts', dest: 'src/bimModel/components/src/Worker' },
		]
	})],
}

// This creates the bundle used by the examples
export default [Revit,];
