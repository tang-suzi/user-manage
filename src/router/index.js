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
      {
        path: "/trainingCenter",
        name: "trainingCenter",
        component: () => import("@/views/TrainingCenter"),
        meta: {
          title: "培训中心",
        },
      },
      {
        path: "/knowledge",
        name: "knowledge",
        component: () => import("@/views/Knowledge/index.vue"),
        meta: {
          title: "知识库检索",
        },
      },
      {
        path: "/expertConsultation",
        name: "expertConsultation",
        component: () => import("@/views/ExpertConsultation/index.vue"),
        meta: {
          title: "专家咨询",
        },
      },
      {
        path: "/expertConsultation/detail/:id",
        name: "expertConsultationDetail",
        component: () =>
          import("@/views/ExpertConsultation/CaseAnalysisDetail.vue"),
        meta: {
          title: "病例分析详情",
          hidden: true,
        },
      },
      {
        path: "/training/quality-evaluation/detail",
        name: "qualityEvaluationDetail",
        component: () =>
          import("@/views/TrainingCenter/QualityEvaluationDetail.vue"),
        meta: {
          title: "多中心质量评价详情",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/index.vue"),
    meta: {
      hidden: true,
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
