import dayjs, { type ManipulateType } from "dayjs";

export const getDatesToSortBy = (sortValue: string) => {
    if (sortValue !== "All time") {
        const [amount, unit] = sortValue.split(" ") as [
            string,
            ManipulateType | undefined
        ];
        return new Date(dayjs().subtract(Number(amount), unit).toString());
    } else {
        return new Date(0);
    }
};
