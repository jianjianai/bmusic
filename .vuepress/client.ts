import './base.css'
import { defineClientConfig } from 'vuepress/client'
import { defineAsyncComponent } from 'vue'

export default defineClientConfig({
  layouts: {
    Home: defineAsyncComponent(() => import('./layouts/Home.vue')),
    NotFound: defineAsyncComponent(() => import('./layouts/NotFound.vue')),
    Find: defineAsyncComponent(() => import('./layouts/Find.vue')),
  },
})
