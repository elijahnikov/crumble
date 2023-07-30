import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function clxsm(...classes: ClassValue[]) {
    return twMerge(clsx(...classes));
}
