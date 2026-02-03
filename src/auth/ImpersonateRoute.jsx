import { useEffect } from "react";
import { apiFunction, createApiFunction } from "../api/ApiFunction";
import { impersonateLoginApi } from "../api/Apis";
import { showSuccessToast } from "../components/toast/toast";
import { useNavigate } from "react-router-dom";

const Impersonate = () => {

    const navigate = useNavigate();
    const loginAsUser = async () => {
        try {
            const token = new URLSearchParams(window.location.search).get("token");

            const res = await createApiFunction("post",
                impersonateLoginApi, null, { token }
            )
            
            if (res && res.data?.token) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
            
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    localStorage.setItem("token", res.data.token);
                    showSuccessToast("Signin successful!");
            
                    await new Promise((res) => setTimeout(res, 400));
                    navigate("/Dashboard/allStats");
                  } else {
                    showErrorToast("Unexpected response from server. Please try again.");
                  }

        } catch (error) {
            console.log("Impersonate login error:", error);
        }
    } 

    useEffect(() => {
        loginAsUser();
    }, []);

    return ( <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700"></div>
  </div>);
};

export default Impersonate;
