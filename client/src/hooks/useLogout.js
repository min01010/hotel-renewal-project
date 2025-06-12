// hooks/useLogout.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice"; // logout 액션 가져오기

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user.userInfo);

  const Logout = async (isApiCall = true) => {
    if (isApiCall) {
    try{
      console.log("Logging out...");
      await axios.post("http://localhost:3001/api/users/logout", { user_unique_id: userState.id, method: userState.method }, { withCredentials: true });
      localStorage.removeItem("accessToken");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
        console.error("Error during logout:", error);  
    }
  }else{
      // API 호출 없이 로그아웃만 처리
      localStorage.removeItem("accessToken");
      dispatch(logout());
      navigate("/login");
  }
  };
  return Logout;
};

export default useLogout;
