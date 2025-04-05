import { useState } from "react";
import { BottomWarning } from "../components/bottom_warning";
import { CustonButton } from "../components/button";
import { CustomInput } from "../components/custom_input";
import { Heading } from "../components/heading";
import { Subheading } from "../components/subheading";
import axios from "axios";
import { useNavigate } from "react-router";
import { Redirect } from "./redirect";

export const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Redirect />
      <div className="bg-white rounded-md w-sm text-black flex flex-col items-center p-5">
        <Heading lable="Sign In" />
        <Subheading description="Enter your credentials to access your account" />
        <CustomInput
          lable="Email"
          placeholder="jhondoe@example.com"
          size="w-xs"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <CustomInput
          lable="Password"
          placeholder="******"
          size="w-xs"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <CustonButton
          lable="Sign In"
          size="xs"
          onClick={async () => {
            const response = await axios.post(
              "http://localhost:3000/api/v1/user/signin",
              {
                username,
                password,
              }
            );
            if (response.status == 200) {
              localStorage.setItem("token", response.data.token);
              navigate("/dashboard");
            }
          }}
        />
        <BottomWarning
          warning="Don't have an account?"
          actionText="Sign Up"
          path="/signup"
        />
      </div>
    </div>
  );
};
