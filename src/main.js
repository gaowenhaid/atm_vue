import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './static/css/reset.css'
import axios from 'axios'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 全局设置 axios 发送请求带上cookie
axios.defaults.withCredentials = true
createApp(App).use(router).use(ElementPlus, {
    locale: zhCn,
}).mount('#app')
