import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build:{
      rollupOptions:{
        input:{
          index: resolve(__dirname, 'src/preload/index.ts'),
          BilibiliMusicPlayer: resolve(__dirname, 'src/preload/players/BilibiliMusicPlayer/BilibiliMusicPlayer.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
