import React, { type ReactElement, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { BsChevronDown } from "react-icons/bs";
import Input from "../Input/Input";
import clxsm from "@/utils/clsxm";

interface SelectProps {
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    value: string;
    setValue: (value: string) => void;
    label?: string;
    size?: "sm" | "md";
    children: ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[];
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    selectedValue?: string;
    setValue?: (value: string) => void;
    setSearchText?: (value: string) => void;
    open?: boolean;
    size?: "sm" | "md";
    setOpen?: (value: boolean) => void;
    onClick?: (value: string) => void;
}

const Select = ({
    placeholder,
    disabled,
    searchable,
    label,
    value,
    setValue,
    children,
    size = "md",
}: SelectProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");

    return (
        <>
            <PopoverPrimitive.Root
                open={open}
                onOpenChange={() => setOpen(!open)}
            >
                <PopoverPrimitive.Trigger disabled={disabled}>
                    {label && (
                        <div className="relative top-[-3px] ml-[2px] text-left">
                            <p
                                className={clxsm(
                                    "text-black dark:text-white",
                                    size === "sm" ? "text-xs" : "text-sm"
                                )}
                            >
                                {label}
                            </p>
                        </div>
                    )}
                    <div
                        className={clxsm(
                            size === "md" ? "px-3 py-2" : "px-2 py-1.5",
                            disabled &&
                                "border-sky-lighter bg-sky-lightest dark:border-ink-dark dark:bg-ink-darker",
                            "flex w-[200px] rounded-md border-[1px] border-slate-200  text-left text-sm dark:border-slate-700"
                        )}
                    >
                        <p
                            className={clxsm(
                                size === "sm" && "text-xs ",
                                "w-[90%] font-normal"
                            )}
                        >
                            {value !== "" ? value : placeholder}
                        </p>
                        <BsChevronDown className="mt-1 fill-ink-light" />
                    </div>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        className={clxsm(
                            size === "md"
                                ? "max-h-[400px] w-[200px] space-y-1 p-[5px]"
                                : "max-h-[400px] w-[200px] space-y-1 p-[3px]",
                            "mt-2  overflow-y-auto rounded-lg border-[1px] border-slate-200 bg-white  dark:border-gray-700 dark:bg-black"
                        )}
                    >
                        {searchable && (
                            <Input
                                className="w-[100%]"
                                size={"sm"}
                                placeholder="Search"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        )}
                        {React.Children.map(children, (child) => {
                            if (
                                child.props.value
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                            ) {
                                return React.cloneElement(child, {
                                    selectedValue: value,
                                    setValue,
                                    setOpen,
                                    open,
                                    setSearchText,
                                });
                            }
                        })}
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
        </>
    );
};

const Item = ({
    value,
    children,
    selectedValue,
    setSearchText,
    setValue,
    open,
    setOpen,
    size = "md",
    onClick,
}: SelectItemProps) => {
    return (
        <div
            onClick={() => {
                setValue && setValue(value);
                setOpen && setOpen(!open);
                setSearchText && setSearchText("");
                onClick && onClick(value);
            }}
            className={clxsm(
                selectedValue === value && "bg-brand-white dark:bg-brand-light",
                size === "md" ? "p-2" : "p-1.5",
                "cursor-pointer rounded-md  pl-[20px] text-sm hover:bg-brand-white dark:hover:bg-brand-light"
            )}
            key={value}
        >
            <p className={clxsm(size === "sm" && "text-xs", "ml-1")}>
                {children}
            </p>
        </div>
    );
};

Select.Item = Item;

export { Select, Item };
