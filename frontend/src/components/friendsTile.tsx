import { CustonButton } from "./button";
import { UserIcon } from "./userIcon";
import { useNavigate } from "react-router";

interface FriendProp {
  username: string;
  userId: string;
}

export const FriendTile = ({ username, userId }: FriendProp) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <UserIcon username={username} />
        <p className="px-2 text-xl font-medium">{username}</p>
      </div>
      <CustonButton
        lable="Send Money"
        size="2xs"
        onClick={() => {
          navigate("/send?id=" + userId + "&name=" + username);
        }}
      />
    </div>
  );
};
