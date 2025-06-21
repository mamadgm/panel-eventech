import { defineStore } from "pinia";
import axios from "axios";
import { API_BASE_URL } from "@/types/const";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    access_token: localStorage.getItem("auth_access_token") || "",
    refresh_token: localStorage.getItem("auth_refresh_token") || "",
    first_name: localStorage.getItem("auth_first_name") || "",
    last_name: localStorage.getItem("auth_last_name") || "",
  }),
  actions: {
    logout() {
      this.access_token = "";
      this.$reset();
      localStorage.removeItem("auth_token");
    },
    async Login(phone_number: string, password: string) {


      const response = await axios.post(
        `${API_BASE_URL}/api/v0/account/login/password/`,
        {
          phone_number: phone_number,
          password: password,
        }
      );

      if (response.data) {
        this.access_token = response.data.access_token;
        this.refresh_token = response.data.refresh_token;
        this.first_name = response.data.first_name;
        this.last_name = response.data.last_name;

        localStorage.setItem("auth_access_token", this.access_token);
        localStorage.setItem("auth_refresh_token", this.refresh_token);
        localStorage.setItem("auth_first_name", this.first_name);
        localStorage.setItem("auth_last_name", this.last_name);
        return response.data;
      } else {
        throw new Error("خظای غیر منتظره");
      }
    },
  },
});

/*
<template>
  <div>
    <div class="grid grid-cols-8">
      <div class="flex flex-col items-center justify-start bg-cyan-500 h-dvh">
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
      </div>

      <div class="col-span-7">
        <Header></Header>
        <div class="bg-red-400 p-1">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
*/
