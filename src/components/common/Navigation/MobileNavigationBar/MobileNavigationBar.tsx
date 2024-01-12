import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import navigation, { secondaryNavigation } from "@/utils/data/navLinks";
import { BiMenu } from "react-icons/bi";
import clxsm from "@/utils/clsxm";
import Profile from "../../Profile/Profile";
import { Menu, MenuIcon } from "lucide-react";
import CreateModalMenu from "../../CreateModalMenu/CreateModalMenu";

const MobileNavigationBar = () => {
    const [currentPath, setCurrentPath] = useState("");

    // const router = useRouter();
    const { data: session } = useSession();
    const authenticated = !!session;

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);
    return (
        <Disclosure
            as="nav"
            className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-brand-light"
        >
            {() => (
                <>
                    <div className="mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center">
                            <div className="block items-center sm:flex">
                                <div className="flex items-center">
                                    <div className="flex">
                                        <Link href="/" className="flex gap-2">
                                            <span className="sr-only">
                                                Crumble
                                            </span>

                                            <Image
                                                alt="Supercrumble logo"
                                                width={40}
                                                height={40}
                                                src="https://i.ibb.co/r4WtSVc/supercrumble800x800.png"
                                            />
                                            <h2 className="my-auto font-bold text-black dark:text-white">
                                                Crumble
                                            </h2>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="inset-y-0 ml-2 mt-1 flex items-center">
                                <Disclosure.Button className="inline-flex  items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <MenuIcon width={18} />
                                </Disclosure.Button>
                            </div>

                            <div className="absolute inset-y-0 right-0 flex items-center pr-2   sm:ml-6 sm:pr-0">
                                <Profile />
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel>
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {authenticated && <CreateModalMenu />}
                            {(authenticated
                                ? [
                                      ...navigation,
                                      ...secondaryNavigation(
                                          session.user.name!
                                      ),
                                  ]
                                : navigation
                            ).map(({ name, href, includeUrls }) => (
                                <Disclosure.Button
                                    key={name}
                                    as="a"
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
                                    aria-current={
                                        currentPath === href
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default MobileNavigationBar;
