import "./assets/main.css"
import router from "./router/router.js"
import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount("#app")
