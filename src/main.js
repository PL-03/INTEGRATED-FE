import "./assets/main.css"
import router from "./router/router.js"
import { createApp } from "vue"
// import { createPinia } from "pinia"
// import "vuetify/styles"
// import { createVuetify } from "vuetify"
// import * as components from "vuetify/components"
import App from "./App.vue"
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

// const vuetify = createVuetify({ components })
const app = createApp(App)

// app.use(createPinia())
// app.component("v-icon", OhVueIcon)
app.use(router)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
})
// app.use(vuetify)
app.mount("#app")
