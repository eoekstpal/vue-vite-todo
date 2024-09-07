import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [vue(), envCompatible()]
});
