import { defineStore } from "pinia";
import axios from "axios";
import { API_BASE_URL } from "@/types/const";
import { useAuthStore } from "@/stores/auth";

type Guest = {
  phone_number: string;
  ticket_number: string;
  first_name: string;
  last_name: string;
  is_vip: boolean;
  is_accepted: boolean;
  datetime_accepted: string | null;
};

type GuestListPage = {
  guests: Guest[];
  count: number;
  num_pages: number;
  next: number | null;
  previous: number | null;

  total_guest: number;
  vip_guest: number;
  unaccepted_guests: number;
  accepted_guests: number;
  accepted_vip_guests: number;
  capacity_hall: string;
};

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
  hall_id: string;
  hall_name: string;
  hall_capacity: string;
  hall_address: string;
  using_algorithm: boolean;
  categories: string[];
};

export const useEventStore = defineStore("event", {
  state: () => ({
    form: {
      name: "",
      start_acceptance: "",
      start_time: "",
      end_time: "",
      hall_id: "",
      categories: ["empty1", "empty2"],
      hall_name: "",
      using_algorithm: false,
      hall_capacity: "",
      hall_address: "",
      image: null as string | File | null,
    },
    events: {} as Record<number, EventGet>, // get events
    guestDataByEventId: {} as Record<number, GuestListPage>, // get guests
  }),
  persist: {
    storage: sessionStorage,
  },
  actions: {
    async createEvent() {
      const formData = new FormData();
      const form = this.form;

      formData.append("name", form.name);
      formData.append("start_acceptance", form.start_acceptance);
      formData.append("start_time", form.start_time);
      formData.append("end_time", form.end_time);
      formData.append("hall_id", form.hall_id);
      formData.append("using_algorithm", "false");
      formData.append("hall_name", form.hall_name);
      formData.append("hall_capacity", form.hall_capacity);
      formData.append("hall_address", form.hall_address);

      form.categories.forEach((cat) => {
        formData.append("categories", cat);
      });

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const token = useAuthStore().access_token;

      const response = await axios.post(
        `${API_BASE_URL}/api/v0/core/`,
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
    async UpdateEvent(id: number) {
      const formData = new FormData();
      const form = this.form;

      formData.append("name", form.name);
      formData.append("start_acceptance", form.start_acceptance);
      formData.append("start_time", form.start_time);
      formData.append("end_time", form.end_time);
      formData.append("hall_id", form.hall_id);
      formData.append("using_algorithm", "false");
      formData.append("hall_name", form.hall_name);
      formData.append("hall_capacity", form.hall_capacity);
      formData.append("hall_address", form.hall_address);

      form.categories.forEach((cat) => {
        formData.append("categories", cat);
      });

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const token = useAuthStore().access_token;

      const response = await axios.patch(
        `${API_BASE_URL}/api/v0/core/${id}/`,
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
        this.form.hall_id = event.hall_id;
        this.form.categories = event.categories;
        this.form.image = event.image;
        this.form.using_algorithm = event.using_algorithm;

        this.form.hall_name = event.hall_name;
        this.form.hall_capacity = event.hall_capacity;
        this.form.hall_address = event.hall_address;
      } else {
        console.error("Event not found with ID", eventId);
        console.log("this.events", this.events);
      }
    },
    async getEventDetails(eventId: number, page = 1) {
      const token = useAuthStore().access_token;

      const response = await axios.get(
        `${API_BASE_URL}/api/v0/event/${eventId}/guest_data/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.guest_list) {
        const { guests, count, num_pages, next, previous } =
          response.data.guest_list;

        const {
          total_guest,
          vip_guest,
          unaccepted_guests,
          accepted_guests,
          accepted_vip_guests,
          capacity_hall,
        } = response.data;

        this.guestDataByEventId[eventId] = {
          guests,
          count,
          num_pages,
          next,
          previous,
          total_guest,
          vip_guest,
          unaccepted_guests,
          accepted_guests,
          accepted_vip_guests,
          capacity_hall,
        };
      } else {
        throw new Error("Guest list not found");
      }
    },
  },
});
