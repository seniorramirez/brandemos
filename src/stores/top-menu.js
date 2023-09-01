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
        title: "Products",
      },
      {
        icon: "BoxIcon",
        pageName: "brands",
        title: "Brands",
      },
      {
        icon: "MapPinIcon",
        pageName: "locations",
        title: "Locations",
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
      {
        icon: "PieChartIcon",
        pageName: "reports",
        title: "Reports",
      }
    ],
  }),
});
