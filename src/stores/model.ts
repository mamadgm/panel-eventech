// stores/modal.ts
import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false as boolean,
    step: 1 as number,
  }),
  actions: {
    open() {
      this.isOpen = true;
      this.step = 1;
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
