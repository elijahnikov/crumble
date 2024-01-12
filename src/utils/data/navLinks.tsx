import {
    Camera,
    CircleUserRound,
    ListOrdered,
    MessageSquareText,
    Settings,
    UserRoundSearch,
} from "lucide-react";

const pages = [
    "movies",
    "reviews",
    "members",
    "lists",
    "profile",
    "settings",
] as const;

type pagesIndex = (typeof pages)[number];

interface NavigationArrayType {
    name: Capitalize<pagesIndex>;
    icon: React.ReactNode;
    href: string;
    includeUrls?: Array<string>;
    as?: string;
}

const navigation: NavigationArrayType[] = [
    {
        name: "Movies",
        icon: <Camera />,
        href: "/movies",
        includeUrls: ["movie", "movies"],
    },
    {
        name: "Reviews",
        icon: <MessageSquareText />,
        href: "/reviews",
        includeUrls: ["review"],
    },
    {
        name: "Members",
        icon: <UserRoundSearch />,
        href: "/members",
    },
    {
        name: "Lists",
        icon: <ListOrdered />,
        href: "/lists",
        includeUrls: ["list", "lists"],
    },
];

export const secondaryNavigation = (
    username: string
): NavigationArrayType[] => {
    return [
        {
            name: "Profile",
            icon: <CircleUserRound />,
            href: "/[username]/profile",
            as: `/@${username}/profile`,
            includeUrls: ["profile"],
        },
        {
            name: "Settings",
            icon: <Settings />,
            href: "/[username]/settings",
            as: `/@${username}/settings`,
            includeUrls: ["settings"],
        },
    ];
};

export default navigation;
