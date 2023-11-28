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
import { FaListAlt } from "react-icons/fa";

const pages = ["movies", "diary", "reviews", "members", "lists"] as const;

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
        name: "Movies",
        icon: BiCameraMovie,
        hoverIcon: BiSolidCameraMovie,
        href: "/movies",
        includeUrls: ["movie"],
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
        name: "Members",
        icon: BsPerson,
        hoverIcon: BsPersonFill,
        href: "/members",
        includeUrls: ["member"],
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
