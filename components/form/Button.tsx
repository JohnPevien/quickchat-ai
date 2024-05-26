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
      className="btn w-full dark:text-white"
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
