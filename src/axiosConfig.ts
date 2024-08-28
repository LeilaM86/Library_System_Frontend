import axios from "axios";
import { auth } from "./services";

axios.defaults.baseURL = "http://localhost:7577/api";

axios.defaults.headers.common["x-auth-token"] = auth.getJwt();

export default axios;
