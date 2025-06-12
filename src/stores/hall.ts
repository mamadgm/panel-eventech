import { defineStore } from "pinia";
import axios from "axios";
import { API_BASE_URL } from "@/types/const";
import { useAuthStore } from "@/stores/auth";

type Hall = {
  id: number;
  name: string;
  capacity: string;
  image: string | null;
  address: string;
  columns: number;
  rows: number;
  label_matrix: string | null;
  position_matrix: number[][] | null;
};

export const useHallStore = defineStore("hall", {
  state: () => ({
    hallsById: {} as Record<number, Hall>,
  }),
    persist: {
    storage: sessionStorage,
  },
  actions: {
    async getDefealutHalls() {
      const token = useAuthStore().access_token;

      const response = await axios.get(`${API_BASE_URL}/api/v0/hall/default/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        const hallsArray: Hall[] = response.data;

        for (const hall of hallsArray) {
          this.hallsById[hall.id] = hall;
        }

        return response.data;
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },

    async getFullHall(id: number) {
      const token = useAuthStore().access_token;

      const response = await axios.get(
        `${API_BASE_URL}/api/v0/hall/default/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        const existing = this.hallsById[id];
        this.hallsById[id] = {
          ...existing,
          ...response.data,
        };

        return response.data;
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },
  },
});
