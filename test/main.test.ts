import { Login } from "./auth.js";
import { createEvent } from "./event.js";
import { errorPrint } from "./helpers.js";
const phone = "09120122012";
const pass = "Test_2012";
let event_id = "0";
let token = "";

describe("Login", () => {
  test("Login the User", async () => {
    try {
      token = await Login(phone, pass);
      expect(token).toBeDefined();
    } catch (error) {
      errorPrint("Login Error", error);
    }
  });

  test("Token length should be greater than or equal to 21", () => {
    expect(token.length).toBeGreaterThanOrEqual(21);
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
