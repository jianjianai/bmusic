import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { createPage, type Theme } from 'vuepress/core';

export default defineUserConfig({
  bundler: viteBundler(),
  pagePatterns: [],
  lang: 'zh-CN',
  title: 'Bmusic',
  description: 'Bmusic —— 一个基于 electron 和 Vue3 的多平台音乐播放器',
  theme: webBmusic(),
});



function webBmusic(): Theme {
  return {
    name: 'bmusic',
    onInitialized: async (app) => {
      //添加home页面
      app.pages.push(await createPage(app, {
        path: '/',
        frontmatter: {
          layout: 'Home',
          title: 'Bmusic —— 一个基于 electron 和 Vue3 的多平台音乐播放器',
        }
      }));
      //添加发现页
      app.pages.push(await createPage(app, {
        path: '/find/',
        frontmatter: {
          layout: 'Find',
          title: '发现音乐',
        }
      }));
    },
  }
}
