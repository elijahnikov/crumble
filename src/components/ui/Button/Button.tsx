/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import React from "react";
import { type IconType } from "react-icons";

const button = cva(
  [
    "inline-flex items-center justify-center rounded-lg font-medium",
    "focus:outline-none focus-visible:ring focus-visible:ring-primary-500",
    "shadow-sm",
    "transition-colors duration-75",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-primary-base text-white",
          "hover:bg-primary-dark active:bg-primary-darker",
        ],
        secondary: [
          "bg-primary-lightest text-primary-base hover:bg-primary-lighter active:bg-white active:text-primary-darker",
          "dark:bg-primary-lighter dark:text-primary-darker dark:hover:bg-primary-light dark:active:bg-white",
        ],
        outline: [
          "bg-none text-primary-base border-[1px] border-primary-base hover:border-primary-dark hover:text-primary-dark active:bg-primary-lightest dark:active:bg-primary-light",
          "dark:bg-none dark:text-primary-base dark:border-primary-base dark:hover:border-primary-base dark:hover:text-primary-base",
        ],
        transparent: [
          "bg-none shadow-none border-none text-primary-base hover:bg-primary-lightest active:bg-primary-lighter",
          "dark:text-primary-base dark:hover:text-primary-base dark:hover:bg-primary-lighter dark:active:bg-primary-light",
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
    VariantProps<typeof button> {
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
        className={button({
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
                className={`${children && "top-[2px]"} relative mr-[10px]`}
              />
            )}
            {children}
            {RightIcon && (
              <RightIcon
                className={`${children && "top-[2px]"} relative ml-[10px]`}
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
