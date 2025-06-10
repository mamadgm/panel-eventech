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
      image: null as string | File | null, // ✅ Updated type
      
    },
    events: {} as Record<number, EventGet>,
  }),
  actions: {
    async createEvent() {
      const formData = new FormData();
      const form = this.form;

      formData.append("name", form.name);
      formData.append("start_acceptance", form.start_acceptance);
      formData.append("start_time", form.start_time);
      formData.append("end_time", form.end_time);
      formData.append("default_hall", form.default_hall.toString());

      form.categories.forEach((cat) => {
        formData.append("categories", cat);
      });

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const token = useAuthStore().access_token;

      const response = await axios.post(`${API_BASE_URL}/api/v0/core/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error("خطایی رخ داده است");
      }
    },
    async UpdateEvent(id: number) {

      const formData = new FormData();
      const form = this.form;

      formData.append("name", form.name);
      formData.append("start_acceptance", form.start_acceptance);
      formData.append("start_time", form.start_time);
      formData.append("end_time", form.end_time);
      formData.append("default_hall", form.default_hall.toString());

      form.categories.forEach((cat) => {
        formData.append("categories", cat);
      });

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const token = useAuthStore().access_token;

      const response = await axios.patch(
        `${API_BASE_URL}/api/v0/core/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
        this.form.image = event.image;
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
