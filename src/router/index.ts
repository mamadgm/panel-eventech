import { createRouter, createWebHistory } from "vue-router";
import mainlayout from "@/layout/mainlayout.vue";
import dashBoard from "@/pages/Landing.vue";
import eventPage from "@/pages/eventPage.vue";

const routes = [
  {
    path: "/",
    component: mainlayout,
    children: [
      { path: "", component: dashBoard },
      { path: "2", component: eventPage },
      // Add more pages here
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
