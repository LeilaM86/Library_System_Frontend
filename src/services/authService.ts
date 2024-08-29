import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User, UserLogin } from "../types";
import { BASE_URL } from "../constans";

const TOKEN_KEY = "token";
const API_BASEURL = `${BASE_URL}/api/auth`;
//const CREDENTIALS = "?username=leila&accessCode=TnYtEb";

axios.defaults.headers.common["x-auth-token"] = getJwt();

async function login(user: UserLogin) {
  const { data: token } = await axios.post(API_BASEURL, user);
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

function loginWithJwt(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getJwt() {
  return localStorage.getItem(TOKEN_KEY);
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

function getCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return null;

  try {
    const user = jwtDecode<User>(token);

    return user;
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
