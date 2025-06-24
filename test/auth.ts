import axios from "axios";
import { API_BASE_URL } from "./helpers";

export async function Login(phone_number: string, password: string) {

  const response = await axios.post(
    `${API_BASE_URL}/api/v0/account/login/password/`,
    {
      phone_number: phone_number,
      password: password,
    }
  );

  if (response.data) {
    return response.data.access_token;
  } else {
    throw new Error("خظای غیر منتظره");
  }
}
