import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoutes = () => {
  const cookies = Cookies.get("Teacher") || null;
  const teacher = JSON.parse(cookies);

  return teacher ? <Outlet/> : <Navigate to="/"/>

}
export default ProtectedRoutes