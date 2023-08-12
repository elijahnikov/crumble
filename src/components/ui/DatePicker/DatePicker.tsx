import React, { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import Button from "../Button/Button";
import Calendar from "../Calendar/Calendar";
import { SetStateType } from "@/utils/types/helpers";

interface DatePickerProps {
    buttonText: string;
    dateValue: Date;
    selectDateValue: SetStateType<Date | undefined>;
}

const DatePicker = ({
    buttonText,
    dateValue,
    selectDateValue,
}: DatePickerProps) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <PopoverPrimitive.Root open={open} onOpenChange={() => setOpen(!open)}>
            <PopoverPrimitive.Trigger>
                <p className="rounded-lg bg-brand-light p-[4px] text-sm">
                    {buttonText}
                </p>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content className="z-50 mt-2 space-y-1 rounded-lg border-[2px] border-sky-light bg-white p-[5px] dark:border-slate-800 dark:bg-black">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={selectDateValue}
                    />
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
};
export default DatePicker;
