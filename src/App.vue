<template>
  <router-view />
</template>

<script setup>

  import { useAuthStore } from "@/stores/auth";

  const authStore = useAuthStore();
  
  const token = localStorage.getItem("token");
  const data_user = localStorage.getItem("user");

  if(token){
    console.log(token);
    console.log(data_user);
    authStore.setToken(token);
    authStore.setUser(JSON.parse(data_user));
  }

</script>