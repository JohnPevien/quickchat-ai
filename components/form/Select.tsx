import React, { useState } from "react";
type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
    className?: string;
    options: string[];
};
export default function Select({
    className = "",
    onChange,
    options,
    value,
    ...props
}: Props) {
    return (
        <select
            {...props}
            className={`
        bg-background border border-border text-foreground
        rounded-md px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        hover:border-muted-foreground
        transition-colors
        ${className}
      `}
            onChange={onChange}
            value={value}
        >
            <option disabled value="">
                Select an option
            </option>
            {options.map((option) => (
                <option
                    value={option}
                    key={option}
                    className="bg-background text-foreground"
                >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
            ))}
        </select>
    );
}
