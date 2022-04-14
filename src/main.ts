import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

class C {
  x = 0
  y = 0
}
type t0 = InstanceType<typeof C>
const a: t0 = {
  x: 1,
  y: 0
}
console.log(a)
const app = createApp(App).use(store).use(router)
app.use(ElementPlus)
app.mount('#app')
