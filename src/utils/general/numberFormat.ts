export const numberFormatWithSuffix = (value: number) => {
    return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
};
