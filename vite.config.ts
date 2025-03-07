import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import Meta from "./meta.json"

export default defineConfig({
  plugins: [vue(),jsx()],
  
  /**
   * @deprecated
   * 不再使用 vite 进行打包，vite打包后的项目结构无法复合我的需求
   */
  build:{
    emptyOutDir:true,
    lib:{
      entry:Meta,
      fileName: (format, entryName) => {
        const ext = format==="cjs"?"cjs":"js";
        const dir = format==="cjs"?"commonjs":"es";
        return `${dir}/${entryName}.${ext}`
      },
    },
    rollupOptions:{
      external:["echarts","marked",'vue']
    }
  }
})
