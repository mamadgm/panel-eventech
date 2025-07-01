// stores/modal.ts
import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    step: 1,
    cinemaState : false
  }),
  actions: {
    open() {
      this.isOpen = true;
      this.step = 1;
      this.cinemaState = false ;
    },
    close() {
      this.isOpen = false;
    },
    next() {
      if (this.step < 4) this.step++;
    },
    prev() {
      if (this.step > 1) this.step--;
    },
    goTo(n: number) {
      if (n >= 1 && n <= 4) this.step = n;
    },

  },
});
