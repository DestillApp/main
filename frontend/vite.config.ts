import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue(), sentryVitePlugin({
    org: "hannakaczynska",
    project: "distill-it"
  })],

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  build: {
    sourcemap: true
  }
});