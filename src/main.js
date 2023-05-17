import { createApp,defineAsyncComponent } from "vue/dist/vue.esm-bundler.js";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";

import axios from 'axios';
window.axios = axios;

const app = createApp(App).use(router).use(createPinia());

globalComponents(app);
utils(app);

app.mount("#app");
