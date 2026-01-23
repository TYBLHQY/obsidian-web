import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout"),
      children: [
        {
          path: "",
          component: () => import("@/views/Home"),
        },
        {
          path: "/develop",
          component: () => import("@/views/Develop"),
        },
      ],
    },
  ],
});

export default router;
