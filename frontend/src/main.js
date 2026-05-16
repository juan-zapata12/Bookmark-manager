import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/styles.css'
import './assets/bookmark-styles.css'
import './assets/admin-styles.css'
import './assets/search-styles.css'
import './assets/icons-styles.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
