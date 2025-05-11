import { FC, ButtonHTMLAttributes } from "react";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
