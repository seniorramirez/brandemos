import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import SimpleMenu from "../layouts/simple-menu/Main.vue";
import TopMenu from "../layouts/top-menu/Main.vue";
import Page1 from "../views/page-1/Main.vue";
import Page2 from "../views/page-2/Main.vue";
import Login from "../views/login/Main.vue";
import Dashboard from "../views/dashboard/Main.vue";

const isAuth = localStorage.getItem("token");

const routes = [
  {
    path: "/",
    component: TopMenu,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/page-2",
        name: "top-menu-page-2",
        component: Page2,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});



router.beforeEach((to,from) => {
  if( !isAuth && to.name !== 'login'){
    return { name: 'login' }
  }


});

export default router;
