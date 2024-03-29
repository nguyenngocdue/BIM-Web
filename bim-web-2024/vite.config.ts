import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const config = () => {
  const env = loadEnv('development', "");
  return {
    plugins: [react()],
    Worker: {
      plugins: [react()]
    },
    server: {
      port: env.PORT || 3002
    },
    resolver: {
      alias: {
        // '@bimModel': path.resolve(__dirname, './arc/bimModel'),
      }
    }
  }
}
// https://vitejs.dev/config/'
//@ts-ignore
export default defineConfig(config)
