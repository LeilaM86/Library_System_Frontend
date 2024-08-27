import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../services";

function ProtectedRoute() {
  const user = auth.getCurrentUser();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={location.pathname} />;

  return <Outlet />;
}

export default ProtectedRoute;
