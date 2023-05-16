<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="w-6"
              src="@/assets/images/logo.svg"
            />
            <span class="text-white text-lg ml-3"> Icewall </span>
          </a>
          <div class="my-auto">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="-intro-x w-1/2 -mt-16"
              src="@/assets/images/illustration.svg"
            />
            <div
              class="-intro-x text-white font-medium text-4xl leading-tight mt-10"
            >
              A few more clicks to <br />
              sign in to your account.
            </div>
            <div
              class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400"
            >
              Manage all your e-commerce accounts in one place
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2
              class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"
            >
              Iniciar sesión
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
              A few more clicks to sign in to your account. Manage all your
              e-commerce accounts in one place
            </div>
            <div class="intro-x mt-8">
              <input
                type="text"
                class="intro-x login__input form-control py-3 px-4 block"
                placeholder="Email"
                v-model="form.email"
                :class="form_invalid.email ? 'invalid' : ''"
              />
              <input
                type="password"
                class="intro-x login__input form-control py-3 px-4 block mt-4"
                placeholder="Password"
                v-model="form.password"
                :class="form_invalid.password ? 'invalid' : ''"
              />
            </div>

            <div class="intro-x mt-2 text-danger dark:text-danger text-center xl:text-left" v-if="msg_error_login">
                El usuario no se encuentra registrado por favor validar
            </div>
            
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button
                class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top"
                @click="login"
                :disabled="loading_login"
              >
                Login
              </button>
              
            </div>
            
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive,ref} from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";

let form = reactive({
    email: null,
    password: null
});

let form_invalid = reactive({
    email: null,
    password: null
});

let msg_error_login = ref(false);
let loading_login = ref(false);


function login(){

    let error = false;


    if(!form.email){
        form_invalid.email = true;
        error = true;
    }else{
        form_invalid.email = false;
        error = false;
    }

    if(!form.password){
        form_invalid.password = true;
        error = true;
    }else{
        form_invalid.password = false;
        error = false;
    }

    if(error) return;

    loading_login.value = true;

    axios.post('https://brandemos.jgdigitalstudio.com/wp-json/jwt-auth/v1/token',{
        username: form.email,
        password: form.password
    }).then(res => {

        loading_login.value = false;
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("user",JSON.stringify({
            user_email: res.data.user_email,
            user_nicename: res.data.user_nicename,
            user_display_name: res.data.user_display_name
        }));

        window.location.href = "/";
        
    }).catch(res => {
        console.log(res);
        loading_login.value = false;
        msg_error_login.value = true;
    });

}

onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});

</script>
