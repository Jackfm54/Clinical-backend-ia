import React from "react";
import { Navigate } from "react-router-dom";

/**
 * @param {ReactNode} children
 * @param {Array} allowedRoles
 * @returns {ReactNode}
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
