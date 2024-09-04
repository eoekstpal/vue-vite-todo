import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [vue(), envCompatible()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
