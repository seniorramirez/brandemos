import { createApp,defineAsyncComponent } from "vue/dist/vue.esm-bundler.js";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import endpoint from "./utils/endpoint";
import VCalendar from 'v-calendar';
import vSelect from 'vue-select'



import axios from 'axios';
window.axios = axios;

endpoint.setPath(window.location.host);


const app = createApp(App).use(router).use(createPinia());

app.use(VCalendar, {});
globalComponents(app);
utils(app);

app.component('VueDatePicker', VueDatePicker);
app.component('v-select', vSelect)

app.mount("#app");
