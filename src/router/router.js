import { createRouter, createWebHistory } from "vue-router";
import TaskManager from "@/TaskManager.vue";
import StatusManager from "@/StatusManager.vue";

const routes = [
  {
    path: "/task",
    name: "tasklist",
    component: TaskManager,
  },
  {
    path: "/task/add",
    name: "taskadd",
    component: TaskManager,
  },
  {
    path: "/task/:taskId",
    name: "taskdetail",
    component: TaskManager,
    beforeEnter: (to, from, next) => {
      if (to.params.taskId !== Number) {
        alert("Page Not Found");
        next({ name: "tasklist" });
      } else {
        next();
      }
    },
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
    path: "/status/add",
    name: "statusadd",
    component: StatusManager,
  },
  {
    path: "/status/:id/edit",
    name: "statusedit",
    component: StatusManager,
    beforeEnter: (to, from, next) => {
      if (to.params.id === "1" || to.params.id === "7") {
        alert("The default status cannot be edited or deleted.");
        next({ name: "statusList" });
      } else {
        next();
      }
    },
  },
  {
    path: "/",
    redirect: "/task",
  },
  {
    path: "/:catchNotMatchPath(.*)*",
    name: "notFound",
    beforeEnter: (to, from, next) => {
      alert("Page Not Found");
      next({ name: "tasklist" });
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
