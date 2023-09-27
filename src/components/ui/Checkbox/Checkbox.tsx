import { type VariantProps, cva } from "class-variance-authority";
import React, { type InputHTMLAttributes, useRef } from "react";

const checkbox = cva([], {
    variants: {
        intent: {
            default:
                "rounded-lg relative h-4 w-4 top-1 accent-crumble-base dark:hover:accent-crumble-dark hover:accent-crumble-dark dark:accent-crumble-base rounded cursor-pointer",
        },
        size: {
            sm: "h-3 w-3 text-sm",
            base: "h-4 w-4 text-md",
            large: "h-5 w-5 text-md",
        },
        disabled: {
            true: "cursor-not-allowed pointer-events-none",
        },
        error: {
            true: "border-[2px] border-red-500",
        },
    },
    defaultVariants: {
        size: "base",
        intent: "default",
    },
});

interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "disabled">,
        VariantProps<typeof checkbox> {
    label?: string;
    text?: string;
    error?: boolean;
    errorText?: string;
    disabled?: boolean;
    fullWidth?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({
        intent,
        className,
        size,
        disabled,
        fullWidth,
        label,
        text,
        error,
        errorText,
        ...props
    }) => {
        const checkboxRef = useRef<HTMLInputElement | null>(null);
        return (
            <div className={`${fullWidth ? "w-[100%]" : "w-max"}`}>
                {label && (
                    <div>
                        <label className="text-sm text-ink-base dark:text-sky-base">
                            {label}
                        </label>
                    </div>
                )}
                <div className="flex">
                    <input
                        {...props}
                        ref={checkboxRef}
                        className={checkbox({
                            intent,
                            size,
                            error,
                            disabled,
                            className,
                        })}
                        disabled={disabled}
                        type="checkbox"
                    />
                    {text && <p className="ml-[0.5vw]">{text}</p>}
                </div>
                {errorText && (
                    <p
                        className={`${
                            checkboxRef.current &&
                            `w-[${checkboxRef.current.offsetWidth}px]`
                        } ml-[2px] mt-[5px] text-sm text-red-500`}
                    >
                        {errorText}
                    </p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
