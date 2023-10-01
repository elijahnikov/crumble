import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import clxsm from "@/utils/clsxm";
import { useEffect, useState } from "react";
import DarkModeSwitch from "../../DarkModeSwitch/DarkModeSwitch";
import navigation from "@/utils/data/navLinks";
import SignIn from "../../SignIn/SignIn";
import CreateModalMenu from "../../CreateModalMenu/CreateModalMenu";
import AvatarMenu from "../AvatarMenu/AvatarMenu";
import MoreMenu from "../MoreMenu/MoreMenu";
import { LOGO_URL } from "@/constants";
import Notifications from "../../Notifications/Notification";

const NavigationBar = () => {
    const [currentPath, setCurrentPath] = useState("");

    const { data: session } = useSession();
    const authenticated = !!session;

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    return (
        <div className="flex h-screen min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-brand-light lg:w-56">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
                <div className="flex border-b px-4 pb-4 dark:border-gray-700">
                    <Link href="/" className="flex gap-2">
                        <span className="sr-only">Crumble</span>

                        <Image
                            alt="Supercrumble logo"
                            width={40}
                            height={40}
                            src={LOGO_URL}
                        />
                        <h2 className="my-auto font-bold text-black dark:text-white">
                            Crumble{" "}
                        </h2>
                    </Link>
                </div>
                <nav
                    className="mt-5 flex-1 space-y-1 bg-white px-2 dark:bg-brand-light"
                    aria-label="Sidebar"
                >
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clxsm(
                                currentPath === item.href ||
                                    (item.includeUrls &&
                                        item.includeUrls?.includes(
                                            currentPath.split("/")[1] ?? ""
                                        ))
                                    ? "bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:bg-brand dark:text-white"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:bg-brand",
                                "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                            )}
                        >
                            {currentPath === item.href ? (
                                <item.hoverIcon
                                    className={clxsm(
                                        "dark:fill-white",
                                        "mr-3 h-6 w-6 flex-shrink-0 text-brand"
                                    )}
                                    aria-hidden="true"
                                />
                            ) : (
                                <item.icon
                                    className={clxsm(
                                        "dark:fill-white",
                                        "mr-3 h-6 w-6 flex-shrink-0 text-brand"
                                    )}
                                    aria-hidden="true"
                                />
                            )}

                            <span className="flex-1">{item.name}</span>
                        </Link>
                    ))}
                    <MoreMenu />
                </nav>
            </div>
            {authenticated ? (
                <div className="mb-5 text-center">
                    <CreateModalMenu />
                </div>
            ) : null}
            {authenticated ? (
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
                    <div className="group block w-full flex-shrink-0">
                        <div className="flex items-center">
                            <AvatarMenu
                                username={session.user.name!}
                                avatar={session.user.image}
                            />
                            <div className="ml-3 flex">
                                <p className="mt-[5px] text-sm font-medium text-gray-700 dark:text-white">
                                    {session?.user.name}
                                </p>
                                <DarkModeSwitch />
                                <Notifications />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-5 text-center">
                    <SignIn callbackUrl={"/"} />
                </div>
            )}
        </div>
    );
};

export default NavigationBar;
