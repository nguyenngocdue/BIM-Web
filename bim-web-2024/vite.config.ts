import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// https://vitejs.dev/config/

//@ts-ignore
export default defineConfig(() => {
  const env = loadEnv('development', process.cwd(), "");
  return {
    plugins: [react()],
    Worker: {
      plugins: [react()]
    },
    server: {
      port: env.PORT || 3002
    },
    estbuild: {
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    },
    resolver: {
      alias: {
        "@bimModel": path.resolve(__dirname, "./src/bimModel"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@component": path.resolve(__dirname, "./src/component"),
        "@pages": path.resolve(__dirname, "./src/pages"),
      },
    },
    build: {
      sourcemap: true,
      minify: false,
      rollupOptions: {
        external: ["react", "jsx", "three"],
      }
    }
  }
});