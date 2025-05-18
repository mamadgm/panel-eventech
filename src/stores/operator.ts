import { defineStore } from "pinia";
import axios from "axios";
import { API_BASE_URL } from "@/types/const";
import { useAuthStore } from "@/stores/auth";

type OperatorGet = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export const useOperatorStore = defineStore("operators", {
  state: () => ({
    form: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      password_confirm: "",
    },
    operators: {} as Record<number, OperatorGet>,
  }),
  actions: {
    async getOperators(id: number) {
      const authStore = useAuthStore();
      const token = authStore.access_token;

      const response = await axios.get(
        `${API_BASE_URL}/api/v0/operators/${id}`, //event-id
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const operArray: OperatorGet[] = response.data;

        for (const oper of operArray) {
          this.operators[oper.id] = oper;
        }
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },
  },
});
