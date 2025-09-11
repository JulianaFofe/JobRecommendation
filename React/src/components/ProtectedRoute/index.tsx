import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface JwtPayload {
  sub: string; // user/employer ID
  role: string;
  name?: string;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // No token, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Optionally, you can dynamically redirect based on role
    // e.g., if someone tries to access employer page but is admin, redirect them
    const currentPath = window.location.pathname;

    if (decoded.role === "admin" && currentPath !== "/dashview") {
      return <Navigate to="/dashview" replace />;
    } else if (decoded.role === "employer" && currentPath !== "/employer") {
      return <Navigate to="/employer" replace />;
    } else if (decoded.role === "employee" && currentPath !== "/employeedash") {
      return <Navigate to="/employeedash" replace />;
    }

    // Token valid and role matches current route
    return children;
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.removeItem("access_token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
