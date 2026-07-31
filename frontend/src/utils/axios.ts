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
  })  ;


 api.interceptors.request.use((config)=>{
    console.log("Sending Request:",config.method?.toUpperCase(),config.url);
    return config
 })


api.interceptors.response.use(
  (response) =>{
    return response;
  },
  (error) =>{
    if(!error.response){
      console.log("No response from backend");
      return Promise.reject(error)
    }

    if(error.response?.status >= 500){
      console.log("Server Error");
      return Promise.reject(error)
    }

    if(error.response?.status === 404){
      console.log("Resource Not Found");
      return Promise.reject(error)
    }

    console.log(error.message);
    return Promise.reject(error)
  }
)

  return api;
};

export default createApi;
