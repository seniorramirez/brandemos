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
import Users from "../views/users/Main.vue";
import Brands from "../views/brands/Main.vue";

const isAuth = localStorage.getItem("token");

const routes = [
  {
    path: "/demonstrations/",
    component: TopMenu,
    children: [
      {
        path: "/demonstrations/",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/demonstrations/products",
        name: "products",
        component: Products,
      },
      {
        path: "/demonstrations/brands",
        name: "brands",
        component: Brands,
      },
      {
        path: "/demonstrations/locations",
        name: "locations",
        component: Locations,
      },
      {
        path: "/demonstrations/samples",
        name: "samples",
        component: Samples,
      },
      {
        path: "/demonstrations/users",
        name: "users",
        component: Users,
      },
    ],
  },
  {
    path: "/demonstrations/login",
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
