import axios from "axios";
import Cookies from "js-cookie";
import { getRefreshToken } from "../helpers";
const network = axios.create();

const getAccessToken = () => Cookies.get("accessToken");

network.interceptors.request.use((config) => {
  // console.log(config.url);
  // if(config.url && !config.url.includes("auth")){
  //   config.url = config.url.replace("/api/v1", `/api/v1/`)
  // }
  config.headers.authorization = `bearer ${getAccessToken()}`;
  return config;
});

network.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    if (status === 403) {
      try {
        await network.post("/api/v1/auth/token", {
          refreshToken: getRefreshToken(),
        });
        const data = await network(originalRequest);
        return data;
      } catch (err) {
        throw err;
      }
    } else {
      throw error;
    }
  }
);

export default network;
