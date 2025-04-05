import axios, { AxiosRequestConfig } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Redirect = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/signup");
    return;
  }

  const config: AxiosRequestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/me", config)
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => {
        navigate("/signup");
      });
  }, []);

  return null;
};
