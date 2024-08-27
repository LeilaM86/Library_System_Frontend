import axios from "axios";
import { UserRegister } from "../types";
import { auth } from ".";

const API_BASEURL = "http://localhost:7577/api/users";
//const CREDENTIALS = "?username=leila&accessCode=TnYtEb";

async function register(user: UserRegister) {
  const { headers } = await axios.post(API_BASEURL, user);
  const token = headers["x-auth-token"];
  auth.loginWithJwt(token);
}

export default {
  register,
};
