import type { IconType } from "react-icons";
import {
    BiCameraMovie,
    BiCommentDetail,
    BiSolidCameraMovie,
    BiSolidCommentDetail,
} from "react-icons/bi";
import {
    BsBook,
    BsBookFill,
    BsCardList,
    BsPerson,
    BsPersonFill,
} from "react-icons/bs";
import { FaList, FaListAlt } from "react-icons/fa";

const pages = ["films", "diary", "reviews", "people", "lists"] as const;

type pagesIndex = (typeof pages)[number];

type NavigationArrayType = Array<{
    name: Capitalize<pagesIndex>;
    icon: IconType;
    hoverIcon: IconType;
    href: `/${pagesIndex}`;
    includeUrls?: Array<string>;
}>;

const navigation: NavigationArrayType = [
    {
        name: "Films",
        icon: BiCameraMovie,
        hoverIcon: BiSolidCameraMovie,
        href: "/films",
        includeUrls: ["film"],
    },
    { name: "Diary", icon: BsBook, hoverIcon: BsBookFill, href: "/diary" },
    {
        name: "Reviews",
        icon: BiCommentDetail,
        hoverIcon: BiSolidCommentDetail,
        href: "/reviews",
        includeUrls: ["review"],
    },
    {
        name: "People",
        icon: BsPerson,
        hoverIcon: BsPersonFill,
        href: "/people",
    },
    {
        name: "Lists",
        icon: BsCardList,
        hoverIcon: FaListAlt,
        href: "/lists",
        includeUrls: ["list", "lists"],
    },
];

export default navigation;
