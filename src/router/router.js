import { createRouter, createWebHistory } from "vue-router"
import TaskManager from "@/TaskManager.vue"
import StatusManager from "@/StatusManager.vue"
const routes = [
  {
    path: "/task",
    name: "tasklist",
    component: TaskManager,
  },
  {
    path: "/task/:taskId",
    name: "taskdetail",
    component: TaskManager,
  },
  {
    path: "/",
    redirect: "/task",
  },
  {
    path: "/task",
    redirect: "/task",
  },
  {
    path: "/task/add",
    name: "taskadd",
    component: TaskManager,
  },
  {
    path: "/task/:taskId/edit",
    name: "taskedit",
    component: TaskManager,
  },
  {
    path: "/status",
    name: "statusList",
    component: StatusManager,
  },
  {
    path: "/status/:id/edit",
    name: "statusedit",
    component: StatusManager,
    beforeEnter: (to, from, next) => {
      if (to.params.id === "1") {
        alert("The default status cannot be edited or deleted.")
        next({ name: "statusList" })
      } else {
        next()
      }
    },
  },
  {
    path: "/status/add",
    name: "statusadd",
    component: StatusManager,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
