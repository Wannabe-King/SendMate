import { useEffect, useState } from "react";
import { CustomInput } from "../components/custom_input";
import { FriendTile } from "../components/friendsTile";
import { Heading } from "../components/heading";
import { UserIcon } from "../components/userIcon";
import axios, { AxiosRequestConfig } from "axios";
import debounce from "lodash.debounce";
import { Redirect } from "./redirect";

interface User {
  firstName: string;
  _id: string;
}

export const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const config: AxiosRequestConfig = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", config)
      .then((response) => {
        console.log(response.data.account.balance);
        if (response.data?.account?.userId?.firstName) {
          setUsername(response.data.account.userId.firstName);
        } else {
          console.warn("userId or firstName is missing:", response.data);
        }

        setBalance(response.data.account.balance);
      })
      .catch((err) => console.error("Error fetching account:", err));
  }, []);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      axios
        .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, config)
        .then((response) => {
          setUsers(response.data.users);
        });
    }, 500);

    debouncedFetch();
  }, [filter]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Redirect />
      <div className="w-4xl bg-white rounded-md text-black p-5">
        <div className="flex justify-between items-center mb-5">
          <Heading lable="Payment App" />
          <div className="pt-3 flex items-center">
            <span className="text-2xl mx-2"> Hello, {username}</span>

            <UserIcon username={username} />
          </div>
        </div>
        <hr className="text-slate-300" />
        <div className=" py-3 ">
          <div className="text-2xl font-bold">
            <p>
              Your Balance: ₹<span className="font-semibold">{balance}</span>
            </p>
            <p className="mt-5">Users</p>
          </div>

          <CustomInput
            lable=""
            placeholder="Search users ..."
            size="w-full my-3"
            onChange={(e) => setFilter(e.target.value)}
          />
          {users.map((user) =>
            user.firstName != username ? (
              <FriendTile
                key={user._id}
                username={user.firstName}
                userId={user._id}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
