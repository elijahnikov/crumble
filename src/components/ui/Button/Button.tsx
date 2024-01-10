/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import React from "react";
import { type IconType } from "react-icons";

export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center rounded-lg font-medium",
        "focus:outline-none focus-visible:ring focus-visible:ring-crumble-500",
        "shadow-sm",
        "transition-colors duration-75",
    ],
    {
        variants: {
            intent: {
                primary: [
                    "bg-crumble-base text-white",
                    "hover:bg-crumble-dark active:bg-crumble-darker",
                ],
                secondary: [
                    "bg-gray-100 border-[1px] border-gray-200 dark:border-[0px] text-gray-600 dark:text-white hover:bg-gray-200 active:bg-gray-300",
                    "dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:active:bg-gray-500",
                ],
                outline: [
                    "bg-none text-crumble-base border-[1px] border-crumble-base hover:border-crumble-dark hover:text-crumble-dark active:bg-crumble-lightest dark:active:bg-crumble-light",
                    "dark:bg-none dark:text-crumble-base dark:border-crumble-base dark:hover:border-crumble-base dark:hover:text-crumble-base",
                ],
                transparent: [
                    "bg-none shadow-none border-none text-crumble-base hover:bg-crumble-lightest active:bg-crumble-lighter",
                    "dark:text-crumble-base dark:hover:text-crumble-base dark:hover:bg-crumble-lighter dark:active:bg-crumble-light",
                ],
            },
            size: {
                base: "text-sm md:text-base px-3 py-1.5",
                sm: "text-xs md:text-sm px-2 py-1",
                large: "text-md md:text-lg px-7 py-3",
            },
            fullWidth: {
                true: "w-full",
            },
            disabled: {
                true: "cursor-not-allowed pointer-events-none",
            },
        },
        compoundVariants: [
            {
                disabled: true,
                intent: "primary",
                className:
                    "bg-sky-light text-sky-dark dark:bg-ink-dark dark:text-ink-light",
            },
            {
                disabled: true,
                intent: "secondary",
                className:
                    "bg-sky-light text-sky-dark dark:bg-ink-dark dark:text-ink-light",
            },
            {
                disabled: true,
                intent: "outline",
                className:
                    "bg-none text-sky-base border-[1px] border-sky-base dark:text-ink-base dark:border-ink-base",
            },
        ],
        defaultVariants: {
            intent: "primary",
            size: "base",
        },
    }
);

interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
        VariantProps<typeof buttonVariants> {
    children?: React.ReactNode;
    loading?: boolean;
    leftIcon?: IconType;
    rightIcon?: IconType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            intent,
            className,
            size,
            fullWidth,
            disabled,
            loading = false,
            children,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                {...props}
                className={buttonVariants({
                    intent,
                    size,
                    fullWidth,
                    disabled,
                    className,
                })}
            >
                <span
                    className={classNames(
                        "leading-[1.25rem]",
                        loading && "text-transparent"
                    )}
                >
                    <div className="flex">
                        {LeftIcon && (
                            <LeftIcon
                                className={`${
                                    children && "top-[2px]"
                                } relative mr-[10px]`}
                            />
                        )}
                        {children}
                        {RightIcon && (
                            <RightIcon
                                className={`${
                                    children && "top-[2px]"
                                } relative ml-[10px]`}
                            />
                        )}
                    </div>
                </span>
                {loading && (
                    <span className={`absolute block h-4 w-4`}>
                        <svg
                            className="animate-spin"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="fill-current"
                                d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
                            ></path>
                        </svg>
                        <span className="sr-only">Loading</span>
                    </span>
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export default Button;
