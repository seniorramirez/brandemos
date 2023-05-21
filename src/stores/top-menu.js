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
        icon: "BoxIcon",
        pageName: "brands",
        title: "Marcas",
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
        pageName: "users",
        title: "Users",
      },
    ],
  }),
});
