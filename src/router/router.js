import { createRouter, createWebHistory } from "vue-router";
import BoardManager from "@/stores/BoardManager.vue";
import TaskManager from "@/TaskManager.vue";
import StatusManager from "@/StatusManager.vue";
import LoginManager from "@/stores/LoginManager.vue";
import AccessDenied from "@/components/AccessDenied.vue";
import CollabManager from "@/stores/CollabManager.vue";
import InviteConfirmation from "@/components/InviteConfirmation.vue";
import NonActiveInvitation from "@/components/NonActiveInvitation.vue";

const routes = [
  {
    path: "/board",
    name: "boardslist",
    component: BoardManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/:boardId",
    name: "tasklist",
    component: TaskManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/add",
    name: "boardadd",
    component: BoardManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/:boardId/task/add",
    name: "taskadd",
    component: TaskManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/:boardId/task/:taskId",
    name: "taskdetail",
    component: TaskManager,
    beforeEnter: (to, from, next) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      } else if (!parseInt(to.params.taskId)) {
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
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/:boardId/status",
    name: "statusList",
    component: StatusManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/:boardId/status/add",
    name: "statusadd",
    component: StatusManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/board/:boardId/status/:id/edit",
    name: "statusedit",
    component: StatusManager,
    beforeEnter: (to, from, next) => {
      if (!parseInt(to.params.id)) {
        alert("Page Not Found");
        next({ name: "statusList" });
      } else {
        next();
      }
    },
  },
  // {
  //   path: "/board/:boardId/:catchNotMatchPath(.*)*",
  //   component: TaskManager,
  //   beforeEnter: (to, from, next) => {
  //     if (!parseInt(to.params.id)) {
  //       alert("Page Not Found");
  //       next({ name: "tasklist" });
  //     } else {
  //       next();
  //     }
  //   },
  // },
  {
    path: "/board/:boardId/collab",
    name: "collaboratorlist",
    component: CollabManager,
    beforeEnter: (to) => {
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/board/:boardId/collab/invitations",
    name: "invite",
    component: InviteConfirmation,
    beforeEnter: (to) => {
      const isLoggedIn =
        localStorage.getItem("jwtToken") &&
        localStorage.getItem("refreshToken");

      if (!isLoggedIn) {
        return { name: "login", query: { redirect: to.fullPath } };
      }
    },
  },
  {
    path: "/:catchNotMatchPath(.*)*",
    name: "notFound",
    beforeEnter: () => {
      alert("Page Not Found");
      if (
        !localStorage.getItem("jwtToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        alert("Please login first");
        return { name: "login" };
      } else {
        next({ name: "boardslist" });
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginManager,
    beforeEnter: () => {
      if (
        localStorage.getItem("jwtToken") ||
        localStorage.getItem("refreshToken")
      ) {
        return { name: "boardslist" };
      }
    },
  },
  {
    path: "/denial",
    name: "denial",
    component: AccessDenied,
    // beforeEnter: (to) => {
    //   if (
    //     !localStorage.getItem("jwtToken") &&
    //     !localStorage.getItem("refreshToken")
    //   ) {
    //     alert("Please login first");
    //     return { name: "login", query: { redirect: to.fullPath } };
    //   }
    // },
  },
  {
    path: "/sorry",
    name: "sorry",
    component: NonActiveInvitation,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

// if (to.params.id === "1" || to.params.id === "7") {
//   alert("The default status cannot be edited or deleted.");
//   next({ name: "statusList" });
// } else
