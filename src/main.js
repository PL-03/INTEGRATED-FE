import "./assets/main.css"
import router from "./router/router.js"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"
// import "vuetify/styles"
// import { createVuetify } from "vuetify"
// import * as components from "vuetify/components"

const app = createApp(App)

// const vuetify = createVuetify({
//   components,
// })
// app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(Toast, { position: POSITION.TOP_RIGHT })
app.mount("#app")
