import axios from "axios";
import { showErrorToast } from "../components/toast/toast";

//without header
export const createApiFunction = async (type, api, params, data) => {
  let response;
  switch (type) {
    case "get": {
      response = await axios.get(`${api}${params ? `/${params}` : ""}`);
      break;
    }
    case "post": {
      response = await axios.post(`${api}${params ? `/${params}` : ""}`, data);

      break;
    }
  }
  return response;
};

//with header
export const apiFunction = async (type, api, params, data) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    let response;
    switch (type) {
      case "get": {
        response = await axios.get(`${api}${params ? `/${params}` : ""}`, {
          headers,
        });
        break;
      }
      case "post": {
        response = await axios.post(
          `${api}${params ? `/${params}` : ""}`,
          data,
          {
            headers,
          }
        );
        break;
      }
      case "patch": {
        response = await axios.patch(
          `${api}${params ? `/${params}` : ""}`,
          data,
          { headers }
        );
        break;
      }
      case "delete": {
        console.log("dlt case", headers);
        try {
          response = await axios.delete(`${api}${params ? `/${params}` : ""}`, {
            data,
            headers,
          });
        } catch (error) {
          console.log("hfds", error);
        }
        console.log("hgfjdshjfd", response);

        break;
      }
    }
    return response;
  } catch (error) {
    // 👇 401 Unauthorized handling here
    if (error?.response?.status === 401) {
      console.warn("Session expired / Unauthorized");

      localStorage.removeItem("token");
      localStorage.clear(); // optional, agar other keys nahi chahiye

      // optional notification
      showErrorToast("Session expired, please login again.");

      // direct reload & redirect
      window.location.href = "/";
    }

    throw error; // keep the original error alive
  }
};
