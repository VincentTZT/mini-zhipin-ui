import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { envParse, parseLoadedEnv } from 'vite-plugin-env-parse'

export default defineConfig(({ mode }) => {
  const vite_env = parseLoadedEnv(loadEnv(mode, './'))
  console.log('.env', vite_env)

  return {
    plugins: [vue(), envParse()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      // host: '0.0.0.0',
      // port: 8081,
      proxy: {
        [vite_env.VITE_MINI_ZHIPIN_UI_PREFIX]: {
          target: vite_env.VITE_MINI_ZHIPIN_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
// https://vitejs.dev/config/
