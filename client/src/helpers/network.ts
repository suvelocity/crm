import axios from "axios";
import Cookies from "js-cookie";

const network = axios.create();

const getAccessToken = () => Cookies.get("accessToken");
const getRefreshToken = () => Cookies.get("refreshToken");

network.interceptors.request.use((config) => {
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
        await network.post("/api/v1/auth/token", { token: getRefreshToken() });
        const data = await network(originalRequest);
        return data;
      } catch (e) {
        throw e;
      }
    } else {
      throw error;
    }
  }
);

export default network;
