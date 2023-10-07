import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const shortMonthDateFormat = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const fromNow = (date: Date, withoutSuffix?: boolean | undefined) => {
    return dayjs(date).fromNow(withoutSuffix);
};
