import { useState } from "react";
import { CustonButton } from "../components/button";
import { CustomInput } from "../components/custom_input";
import { Heading } from "../components/heading";
import { UserIcon } from "../components/userIcon";
import axios, { AxiosRequestConfig } from "axios";
import { useSearchParams } from "react-router";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState(0);
  const config: AxiosRequestConfig = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center shadow-md ">
      <div className="w-sm bg-white rounded-md text-black p-5">
        <Heading lable="Send Money" />
        <div className="flex items-center mt-5">
          <UserIcon username="User" />
          <p className="text-xl font-medium px-2">{searchParams.get("name")}</p>
        </div>
        <CustomInput
          lable="Amount (in Rs)"
          placeholder="Enter Amount"
          size="xs"
          onChange={(e) => setAmount(e.target.value)}
        />
        <CustonButton
          lable="Initiate Transfer"
          size="full"
          onClick={() => {
            axios.post(
              "http://localhost:3000/api/v1/account/transfer",
              {
                to: searchParams.get("id"),
                amount,
              },
              config
            );
          }}
        />
      </div>
    </div>
  );
};
