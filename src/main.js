import "./assets/main.css"
import router from "./router/router.js"
import { createApp } from "vue"
import { createPinia } from "pinia"
import ToastPlugin from "vue-toast-notification"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import App from "./App.vue"
const vuetify = createVuetify({ components })
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ToastPlugin)
app.use(vuetify)
app.mount("#app")
