import axios from "axios";
import { showErrorToast } from "../components/toast/toast";

//without header
export const createApiFunction = async (type, api, params, data, signal) => {
  let response;
  switch (type) {
    case "get": {
      response = await axios.get(`${api}${params ? `/${params}` : ""}`,{signal});
      break;
    }
    case "post": {
      response = await axios.post(`${api}${params ? `/${params}` : ""}`, data, {signal});

      break;
    }
  }
  return response;
};

//with header
export const apiFunction = async (
  type,
  api,
  params,
  data,
  signal // 👈 optional
) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    let response;

    switch (type) {
      case "get": {
        response = await axios.get(
          `${api}${params ? `/${params}` : ""}`,
          { headers, signal } // 👈 added
        );
        break;
      }

      case "post": {
        response = await axios.post(
          `${api}${params ? `/${params}` : ""}`,
          data,
          { headers, signal } // 👈 added
        );
        break;
      }

      case "patch": {
        response = await axios.patch(
          `${api}${params ? `/${params}` : ""}`,
          data,
          { headers, signal } // 👈 added
        );
        break;
      }

      case "put": {
        response = await axios.put(
          `${api}${params ? `/${params}` : ""}`,
          data,
          { headers, signal }
        );
        break;
      }

      case "delete": {
        response = await axios.delete(
          `${api}${params ? `/${params}` : ""}`,
          { data, headers, signal } // 👈 added
        );
        break;
      }
    }

    return response;
  } catch (error) {
    console.log(error.response);
    
    // ✅ abort case silently ignore
    if (
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {

      return;
    }

    // 👇 existing 401 logic untouched
    if (error?.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.clear();
      showErrorToast("Session expired, please login again.");
      window.location.href = "/";
    }

    throw error;
  
  }
};

