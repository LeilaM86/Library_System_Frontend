import axios from "axios";
import { UserRegister } from "../types";
import authService from "./authService";

const API_BASEURL = "http://localhost:8586/api/users";
//const CREDENTIALS = "?username=leila&accessCode=TnYtEb";

async function register(user: UserRegister) {
  const { headers } = await axios.post(API_BASEURL, user);
  const token = headers["x-auth-token"];
  authService.loginWithJwt(token);
}

export default {
  register,
};
