const { Login } = require("./auth.js");
const { createEvent } = require("./event.js");
const { errorPrint } = require("./helpers.js");
const phone = "09383148670";
const pass = "Amin_1383";
let token = "";
let event_id;

function sum(x, y) {
  return x + y;
}

async function main() {
  describe("Jest", () => {
    test("adds two numbers correctly", () => {
      expect(sum(68, 1)).toBe(70);
    });
  });

  describe("Login", () => {
    test("Login the User", async () => {
      try {
        token = await Login(phone, pass);
        console.log("Token:", token);
        return token;
      } catch (error) {
        errorPrint("Login Error", error);
        throw error;
      }
    });

    test("Token", () => {
      expect(token.length).toBeGreaterThanOrEqual(21); // Check if length is >20
    });
  });

  describe("Creating and Editing Event", () => {
    test("Creating Event", async () => {
      try {
        const response = await createEvent(token, "test_name");
        event_id = response.id;
      } catch (error) {
        errorPrint("createEvent Error", error);
        throw error;
      }
    });

    test("Checking Event Id", () => {
      expect(parseInt(event_id)).toBeGreaterThanOrEqual(1);
      console.log(event_id);
    });
  });
}

/*
<template>
  <SidebarProvider class="w-full">
    <AppSidebar />
    <main class="p-6">
      <SidebarTrigger />
      <router-view />
    </main>
  </SidebarProvider>
</template>
*/

main();
