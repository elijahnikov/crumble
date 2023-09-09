import React, { type ReactElement, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { BsChevronDown } from "react-icons/bs";
import Input from "../Input/Input";

interface SelectProps {
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    value: string;
    setValue: (value: string) => void;
    label?: string;
    children: ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[];
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    selectedValue?: string;
    setValue?: (value: string) => void;
    setSearchText?: (value: string) => void;
    open?: boolean;
    setOpen?: (value: boolean) => void;
}

const Select = ({
    placeholder,
    disabled,
    searchable,
    label,
    value,
    setValue,
    children,
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
                        <div className="relative top-[-5px] text-left">
                            <p className="text-sm text-black dark:text-white">
                                {label}
                            </p>
                        </div>
                    )}
                    <div
                        className={`${
                            disabled &&
                            "border-sky-lighter bg-sky-lightest dark:border-ink-dark dark:bg-ink-darker"
                        } ${"border-slate-200 dark:border-slate-700"}  flex w-[200px] rounded-lg border-[1px] px-3 py-2 text-left text-sm`}
                    >
                        <p className="w-[90%]">
                            {value !== "" ? value : placeholder}
                        </p>
                        <BsChevronDown className="mt-1 fill-ink-light" />
                    </div>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content className="mt-2 max-h-[400px] w-[200px] space-y-1 overflow-y-scroll rounded-lg border-[1px] border-slate-200 bg-white p-[5px] dark:border-gray-700 dark:bg-black">
                        {searchable && (
                            <Input
                                className="w-[100%]"
                                size={"sm"}
                                placeholder="Search"
                                value={searchText}
                                change={setSearchText}
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
}: SelectItemProps) => {
    return (
        <div
            onClick={() => {
                setValue && setValue(value);
                setOpen && setOpen(!open);
                setSearchText && setSearchText("");
            }}
            className={`${
                selectedValue === value && "bg-brand-white dark:bg-brand-light"
            } cursor-pointer rounded-md p-2 pl-[20px] text-sm hover:bg-brand-white dark:hover:bg-brand-light`}
            key={value}
        >
            <p className="ml-1">{children}</p>
        </div>
    );
};

Select.Item = Item;

export { Select, Item };
