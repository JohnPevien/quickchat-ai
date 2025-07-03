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
            className={`
        bg-background border border-border text-foreground
        rounded-md px-3 py-2 text-sm min-h-[2.5rem]
        placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        disabled:cursor-not-allowed disabled:opacity-50
        transition-colors resize-none
        ${className}
      `}
            onChange={onChange}
            value={value}
        />
    );
}
