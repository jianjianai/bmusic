import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 右键菜单组件
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

createApp(App).use(ContextMenu).mount('#app')
