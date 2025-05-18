import { defineStore } from "pinia";
import axios from "axios";
import { API_BASE_URL } from "@/types/const";
import { useAuthStore } from "@/stores/auth";

type EventGet = {
  id: number;
  name: string;
  tracking_number: string;
  image: string | null;
  start_acceptance: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  is_started: boolean;
  hall_name: string;
  hall_capacity: string;
  hall_address: string;
  categories: string[];
};

export const useEventStore = defineStore("event", {
  state: () => ({
    form: {
      name: "",
      start_acceptance: "",
      start_time: "",
      end_time: "",
      default_hall: 0,
      categories: ["empty1", "empty2"],
      image: null,
    },
    events: {} as Record<number, EventGet>,
  }),
  actions: {
    async createEvent() {
      const payload = this.form;
      const token = useAuthStore().access_token;

      const response = await axios.post(
        `${API_BASE_URL}/api/v0/core/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        return response.data;
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },
    async UpdateEvent(id: number) {
      const payload = this.form;
      const token = useAuthStore().access_token;

      const response = await axios.patch(
        `${API_BASE_URL}/api/v0/core/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },

    async getEvents() {
      const token = useAuthStore().access_token;

      const response = await axios.get(`${API_BASE_URL}/api/v0/core/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const eventsArray: EventGet[] = response.data;

        for (const event of eventsArray) {
          this.events[event.id] = event;
        }
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },
    setFormDataFromEventId(eventId: number) {
      const event = this.events[eventId];
      if (event) {
        this.form.name = event.name;
        this.form.start_acceptance = event.start_acceptance;
        this.form.start_time = event.start_time;
        this.form.end_time = event.end_time;
        this.form.default_hall = 3; // TODO: Get From Rasul
        this.form.categories = event.categories;
      } else {
        console.error("Event not found with ID", eventId);
        console.log("this.events", this.events);
      }
    },
    async CreateEvent() {
      const payload = this.form;
      const token = useAuthStore().access_token;
    },
  },
});
