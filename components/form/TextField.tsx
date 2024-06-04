import React from "react";
type Props = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};
export default function TextField({
  className = "",
  onChange,
  value,
  placeholder = "",
}: Props) {
  return (
    <textarea
      placeholder={placeholder}
      className={`textarea textarea-bordered textarea-md dark:text-gray-900  ${className}`}
      onChange={onChange}
      value={value}
    />
  );
}
