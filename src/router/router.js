import { createRouter, createWebHistory } from "vue-router";
import BoardManager from "@/stores/BoardManager.vue";
import TaskManager from "@/TaskManager.vue";
import StatusManager from "@/StatusManager.vue";
import LoginManager from "@/stores/LoginManager.vue";

const routes = [
  {
    path: "/board",
    name: "boardslist",
    component: BoardManager,
    beforeEnter: () => {
      if (!localStorage.getItem("jwtToken")) {
        alert("Please login first");
        return { name: "login" };
      }
    },
  },
  {
    path: "/board/:boardId",
    name: "tasklist",
    component: TaskManager,
  },
  {
    path: "/board/add",
    name: "boardadd",
    component: BoardManager,
  },
  {
    path: "/board/:boardId/task/add",
    name: "taskadd",
    component: TaskManager,
  },
  {
    path: "/board/:boardId/task/:taskId",
    name: "taskdetail",
    component: TaskManager,
    beforeEnter: (to, from, next) => {
      if (!parseInt(to.params.taskId)) {
        alert("Page Not Found");
        next({ name: "boardslist" });
      } else {
        next();
      }
    },
  },
  {
    path: "/board/:boardId/task/:taskId/edit",
    name: "taskedit",
    component: TaskManager,
  },
  {
    path: "/board/:boardId/status",
    name: "statusList",
    component: StatusManager,
  },
  {
    path: "/board/:boardId/status/add",
    name: "statusadd",
    component: StatusManager,
  },
  {
    path: "/board/:boardId/status/:id/edit",
    name: "statusedit",
    component: StatusManager,
    beforeEnter: (to, from, next) => {
      if (to.params.id === "1" || to.params.id === "7") {
        alert("The default status cannot be edited or deleted.");
        next({ name: "statusList" });
      } else if (!parseInt(to.params.id)) {
        alert("Page Not Found");
        next({ name: "statusList" });
      } else {
        next();
      }
    },
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/:catchNotMatchPath(.*)*",
    name: "notFound",
    beforeEnter: (to, from, next) => {
      alert("Page Not Found");
      next({ name: "boardslist" });
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginManager,
    beforeEnter: () => {
      if (localStorage.getItem("jwtToken")) {
        return { name: "boardslist" };
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
