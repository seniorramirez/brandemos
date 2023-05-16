import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import SimpleMenu from "../layouts/simple-menu/Main.vue";
import TopMenu from "../layouts/top-menu/Main.vue";
import Page1 from "../views/page-1/Main.vue";
import Page2 from "../views/page-2/Main.vue";
import Login from "../views/login/Main.vue";
import Dashboard from "../views/dashboard/Main.vue";
import Products from "../views/products/Main.vue";
import Locations from "../views/locations/Main.vue";
import Samples from "../views/samples/Main.vue";

const isAuth = localStorage.getItem("token");

const routes = [
  {
    path: "/",
    component: TopMenu,
    children: [
      {
        path: "/dashboard/home",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/dashboard/products",
        name: "products",
        component: Products,
      },
      {
        path: "/dashboard/locations",
        name: "locations",
        component: Locations,
      },
      {
        path: "/dashboard/samples",
        name: "samples",
        component: Samples,
      },
      {
        path: "/page-2",
        name: "top-menu-page-2",
        component: Page2,
      },
    ],
  },
  {
    path: "/dashboard/login",
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
