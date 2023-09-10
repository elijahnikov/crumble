import type { IconType } from "react-icons";
import { BiCameraMovie, BiCommentDetail } from "react-icons/bi";
import { BsBook, BsCardList, BsPerson } from "react-icons/bs";

const pages = ["films", "diary", "reviews", "people", "lists"] as const;

type pagesIndex = (typeof pages)[number];

type NavigationArrayType = Array<{
    name: Capitalize<pagesIndex>;
    icon: IconType;
    href: `/${pagesIndex}`;
    includeUrls?: Array<string>;
}>;

const navigation: NavigationArrayType = [
    {
        name: "Films",
        icon: BiCameraMovie,
        href: "/films",
        includeUrls: ["film"],
    },
    { name: "Diary", icon: BsBook, href: "/diary" },
    {
        name: "Reviews",
        icon: BiCommentDetail,
        href: "/reviews",
        includeUrls: ["review"],
    },
    { name: "People", icon: BsPerson, href: "/people" },
    {
        name: "Lists",
        icon: BsCardList,
        href: "/lists",
        includeUrls: ["list", "lists"],
    },
];

export default navigation;
