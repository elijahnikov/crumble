import { type VariantProps, cva } from "class-variance-authority";
import React, { useRef } from "react";
import { type TextareaHTMLAttributes } from "react";

const input = cva(
    ["w-[50%] py-2 px-3", "rounded-lg", "border-[1px]", "outline-none"],
    {
        variants: {
            intent: {
                default: [
                    "placeholder-ink-lighter text-black",
                    "dark:placeholder-sky-dark dark:bg-black dark:text-white",
                ],
            },
            size: {
                base: "py-2",
                sm: "text-sm",
                large: "py-4",
            },
            fullWidth: {
                true: "w-full",
            },
            disabled: {
                true: [
                    "placeholder-sky-base text-sky-dark border-sky-lighter bg-sky-lightest cursor-not-allowed pointer-events-none",
                    "dark:placeholder:ink-base dark:text-ink-base dark:border-ink-dark dark:bg-ink-darker",
                ],
            },
            error: {
                true: "border-red-500 dark:border-red-500",
            },
        },
        compoundVariants: [
            {
                disabled: true,
                intent: "default",
                className: " bg-gray-200 dark:bg-gray-950 text-red-400",
            },
            {
                disabled: false,
                intent: "default",
                className: "bg-white dark:bg-black",
            },
            {
                error: true,
                intent: "default",
                className:
                    "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500",
            },
            {
                error: false,
                intent: "default",
                className:
                    "border-sky-light dark:border-slate-800 dark:border-slate-800",
            },
        ],
        defaultVariants: {
            size: "base",
            intent: "default",
        },
    }
);

interface InputAreaProps
    extends Omit<
            TextareaHTMLAttributes<HTMLTextAreaElement>,
            "disabled" | "size" | "error"
        >,
        VariantProps<typeof input> {
    placeholder?: string;
    label?: string;
    caption?: string;
    error?: boolean;
    errorText?: string;
    disabled?: boolean;
    change?: (text: string) => void;
}

const InputArea = React.forwardRef<HTMLTextAreaElement, InputAreaProps>(
    ({
        intent,
        className,
        size,
        disabled,
        error = false,
        errorText,
        placeholder,
        value,
        change,
        fullWidth,
        label,
        ...props
    }) => {
        const inputAreaRef = useRef<HTMLTextAreaElement | null>(null);

        return (
            <>
                {/* if label is passed */}
                {label && (
                    <div className="relative top-[-5px] ml-1">
                        <label className="text-sm text-black dark:text-white">
                            {label}
                        </label>
                    </div>
                )}
                <div className={`relative text-left`}>
                    <textarea
                        ref={inputAreaRef}
                        disabled={disabled}
                        placeholder={placeholder}
                        {...props}
                        value={value}
                        onChange={(e) => change && change(e.target.value)}
                        className={input({
                            fullWidth,
                            className,
                            intent,
                            size,
                            disabled,
                            error,
                        })}
                    />
                    {/* if errorText is passed */}
                    {errorText && (
                        <div
                            className={`${
                                inputAreaRef.current &&
                                `w-[${inputAreaRef.current.offsetWidth}px]`
                            }`}
                        >
                            <p className={`ml-[2px] text-red-500`}>
                                {errorText}
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    }
);

InputArea.displayName = "Input Area";

export default InputArea;
