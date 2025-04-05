interface ButtonProp {
  lable: string;
  size: string;
  onClick: () => void;
}

export const CustonButton = ({ lable, size, onClick }: ButtonProp) => {
  return (
    <div
      className={`bg-black w-${size} rounded-md text-white font-medium text-center py-3 mt-5 mb-2 px-3 cursor-pointer`}
      onClick={onClick}
    >
      {lable}
    </div>
  );
};
