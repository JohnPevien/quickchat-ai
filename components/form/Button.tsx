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
      className="
        w-full px-4 py-2 bg-primary text-primary-foreground 
        hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
        rounded-md font-medium text-sm transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
      "
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
