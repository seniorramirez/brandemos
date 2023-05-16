import { defineStore } from "pinia";

export const useTopMenuStore = defineStore("topMenu", {
  state: () => ({
    menu: [
      {
        icon: "HomeIcon",
        pageName: "dashboard",
        title: "Dashboard",
      },
      {
        icon: "BoxIcon",
        pageName: "products",
        title: "Productos",
      },
      {
        icon: "MapPinIcon",
        pageName: "locations",
        title: "Locación",
      },
      {
        icon: "EyeIcon",
        pageName: "samples",
        title: "Samples",
      },
      {
        icon: "UsersIcon",
        pageName: "top-menu-page-2",
        title: "Users",
      },
    ],
  }),
});
