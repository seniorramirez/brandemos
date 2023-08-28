<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="top-bar-boxed h-[70px] z-[51] relative border-b border-white/[0.08] mt-12 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12"
  >
    <div class="h-full flex items-center">
      <!-- BEGIN: Logo -->
      <a href="" class="-intro-x hidden md:flex">
        <!--<img
          alt="Icewall Tailwind HTML Admin Template"
          class="w-6"
          src="@/assets/images/brandemos.png"
        />-->
        <span class="text-white text-lg ml-3"> Brandemos </span>
      </a>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <nav aria-label="breadcrumb" class="-intro-x h-full mr-auto">
        <ol class="breadcrumb breadcrumb-light">
          <li class="breadcrumb-item"><a href="#">Application</a></li>
          <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
        </ol>
      </nav>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Search -->
      
      <!-- END: Search -->
      <!-- BEGIN: Notifications -->
      
      <!-- END: Notifications -->
      <!-- BEGIN: Account Menu -->
      <Dropdown class="intro-x w-8 h-8">
        <DropdownToggle
          tag="div"
          role="button"
          class="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
        >
          <img
            alt="Icewall Tailwind HTML Admin Template"
            :src="$f()[9].photos[0]"
          />
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent
            class="bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
          >
            <DropdownHeader tag="div" class="!font-normal">
              <div class="font-medium">
                {{ user.user_display_name }}
              </div>
              <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                {{ user.user_email }}
              </div>
            </DropdownHeader>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <LockIcon class="w-4 h-4 mr-2" /> Reset Password</DropdownItem
            >
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5"  @click="resetToken">
              <ToggleRightIcon class="w-4 h-4 mr-2" /> Logout</DropdownItem
            >
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>

<script setup>
import { ref, onMounted } from "vue";

const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};
const user = ref({});

// Función para obtener los datos del localStorage
const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData !== null) {
    user.value = JSON.parse(userData);
  }
};

const resetToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/demonstrations/";
};

// Llamar a la función al cargar el componente
onMounted(getUserData);
</script>
