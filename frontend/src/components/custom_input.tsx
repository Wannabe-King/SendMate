export const CustomInput = ({
  lable,
  placeholder,
  size,
  onChange,
}: {
  lable: string;
  placeholder: string;
  size: string;
  onChange: (e:any) => void;
}) => {
  return (
    <div className="flex flex-col py-2">
      <p className="font-medium">{lable}</p>
      <input
        onChange={onChange}
        type="text"
        placeholder={placeholder}
        className={`${size} rounded-md border border-slate-300 py-2 px-4`}
      />
    </div>
  );
};
