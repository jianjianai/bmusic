import './base.css'
import { defineClientConfig } from 'vuepress/client'
import Home from './layouts/Home.vue'
import NotFound from './layouts/NotFound.vue'
import Find from './layouts/Find.vue'

export default defineClientConfig({
  layouts: {
    Home,
    NotFound,
    Find
  },
})
