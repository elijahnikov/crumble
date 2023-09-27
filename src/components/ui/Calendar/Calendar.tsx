import clxsm from "@/utils/clsxm";
import React from "react";
import { DayPicker } from "react-day-picker";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { buttonVariants } from "../Button/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) => {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={clxsm("z-50 p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: clxsm(
                    buttonVariants({ intent: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: clxsm(
                    "bg-none shadow-none border-none hover:bg-crumble-light",
                    "dark:hover:bg-brand-light",
                    "h-9 w-9 p-0 cursor-pointer font-normal aria-selected:opacity-100",
                    [
                        "inline-flex items-center justify-center rounded-lg font-medium",
                        "focus:outline-none focus-visible:ring focus-visible:ring-crumble-500",
                    ]
                ),
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: () => <BiChevronLeft className="h-4 w-4" />,
                IconRight: () => <BiChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
};

export default Calendar;
