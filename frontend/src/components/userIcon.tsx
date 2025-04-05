export const UserIcon = ({ username }: { username: string }) => {
  return <div className="w-10 h-10 text-xl rounded-3xl bg-slate-200 flex justify-center items-center">{username[0]}</div>;
};
