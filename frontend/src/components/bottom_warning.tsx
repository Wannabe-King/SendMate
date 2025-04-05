import { Link } from "react-router";

export const BottomWarning = ({
  warning,
  actionText,
  path,
}: {
  warning: string;
  actionText: string;
  path: string;
}) => {
  return (
    <div className="font-xl">
      {warning}{" "}
      <Link className="pointer underline" to={path}>
        {actionText}
      </Link>
    </div>
  );
};
