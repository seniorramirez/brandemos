<template>
  <router-view />
</template>

<script setup>

  import { useAuthStore } from "@/stores/auth";
  import endpoint from "./utils/endpoint"

  const authStore = useAuthStore();
  
  const token = localStorage.getItem("token");
  const data_user = localStorage.getItem("user");

  if(token){
    authStore.setToken(token);
    authStore.setUser(JSON.parse(data_user));
    endpoint.setToken(token);
    valdiateToken();
  }

  async function valdiateToken(){
    endpoint.validateToken(token).then(res => {
      if(res.data.data.status !== 200){
        resetToken();
      }
    }).catch(res => {
      resetToken();
    });
  }

  function resetToken(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

</script>