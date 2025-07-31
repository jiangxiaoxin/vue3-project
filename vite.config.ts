import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      // vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html')
      },
      output: {
        // 自定义文件名格式: [name]-[hash]-[version]
        chunkFileNames: (chunkInfo) => {
          const version = process.env.BUILD_VERSION || '0.0.0'
          return `[name]-[hash]-${version}.js`
        },
        entryFileNames: (chunkInfo) => {
          const version = process.env.BUILD_VERSION || '0.0.0'
          return `[name]-[hash]-${version}.js`
        },
        assetFileNames: (assetInfo) => {
          const version = process.env.BUILD_VERSION || '0.0.0'
          const ext = assetInfo.name?.split('.').pop() || 'unknown'
          return `[name]-[hash]-${version}.${ext}`
        }
      }
    }
  }
})
