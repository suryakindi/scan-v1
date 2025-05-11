import { IconPlus } from "@tabler/icons-react";
import { FC, ButtonHTMLAttributes } from "react";

const AddButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  return (
    <button
      type="button"
      className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
      {...props}
    >
      <IconPlus className="size-6" />
    </button>
  );
};

export default AddButton;
