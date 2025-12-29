import Vue from "vue";
import VueRouter from "vue-router";
// import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/components/Layout"),
    children: [
      {
        path: "/institutionalManage",
        name: "institutionalManage",
        component: () => import("@/views/InstitutionalManage"),
        meta: {
          title: "机构管理",
        },
      },
      {
        path: "/roleManage",
        name: "roleManage",
        component: () => import("@/views/RoleManage"),
        meta: {
          title: "角色管理",
        },
      },
      {
        path: "/userManage",
        name: "userManage",
        component: () => import("@/views/UserManage"),
        meta: {
          title: "用户管理",
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
