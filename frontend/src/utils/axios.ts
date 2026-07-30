import axios from "axios";
import { apiBaseUrl } from "../constants/enviromentConstants";

if (!apiBaseUrl) {
  throw new Error("URL Not Found.");
}

const createApi = (path: string) => {

  const api = axios.create({
    baseURL: `${apiBaseUrl}${path}`,
    timeout: 100000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // ToBe Asked : request 
 api.interceptors.request.use((config)=>{
    console.log("Sending Request:",config.method?.toUpperCase(),config.url);
    return config
 })

api.interceptors.response.use((response)=>{
  console.log("Response:",response.status,response.config.method?.toUpperCase())
  return response;
})

  return api;
};

export default createApi;