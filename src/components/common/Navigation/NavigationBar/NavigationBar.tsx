import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CreateModalMenu from "../../CreateModalMenu/CreateModalMenu";
import { LOGO_URL } from "@/constants";
import navigation, { secondaryNavigation } from "@/utils/data/navLinks";
import clxsm from "@/utils/clsxm";

const NavigationBar = ({ children }: { children: React.ReactNode }) => {
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
                    <div className="grid gap-1">
                        {navigation.map(({ name, href, icon, includeUrls }) => (
                            <Link
                                key={name}
                                href={href}
                                className={clxsm(
                                    currentPath === href ||
                                        includeUrls?.includes(href)
                                        ? "bg-slate-100 dark:bg-slate-700"
                                        : "",
                                    `flex items-center space-x-3 rounded-lg px-2`,
                                    `py-1.5 transition-all duration-150 ease-in-out`,
                                    `hover:bg-slate-100 active:bg-slate-200 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-800`
                                )}
                            >
                                {icon}
                                <span className="text-sm font-medium">
                                    {name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
            {authenticated ? (
                <div className="mb-5 text-center">
                    <CreateModalMenu />
                </div>
            ) : null}
            <div>
                <div className="grid gap-1 px-2">
                    {session &&
                        secondaryNavigation(session.user.name!).map(
                            ({ name, href, icon, as }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    as={as}
                                    className={clxsm(
                                        currentPath.split("/")[2] ===
                                            href.split("/")[2]
                                            ? "bg-slate-100 dark:bg-slate-700"
                                            : "",
                                        `flex items-center space-x-3 rounded-lg px-2`,
                                        `py-1.5 transition-all duration-150 ease-in-out`,
                                        `hover:bg-slate-100 active:bg-slate-200 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-800`
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        {icon}
                                        <span className="text-sm font-medium">
                                            {name}
                                        </span>
                                    </div>
                                </Link>
                            )
                        )}
                </div>
                <div className="mt-2 border-t border-slate-200 dark:border-slate-700" />
                <div className="p-3">{children}</div>
            </div>
        </div>
    );
};

export default NavigationBar;
