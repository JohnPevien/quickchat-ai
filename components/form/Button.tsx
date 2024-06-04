import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};
export default function Button({
  children,
  onClick,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      className="btn w-full dark:text-white dark:bg-blue-700 bg-blue-500 p-2 text-white"
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
