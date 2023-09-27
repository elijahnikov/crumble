import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import navigation from "@/utils/data/navLinks";
import SignIn from "../../SignIn/SignIn";
import AvatarMenu from "../AvatarMenu/AvatarMenu";
import DarkModeSwitch from "../../DarkModeSwitch/DarkModeSwitch";
import { BiMenu } from "react-icons/bi";

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
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <BiMenu />
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center">
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
                                                Crumble{" "}
                                            </h2>
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-2 pt-[5px]">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    currentPath === item.href
                                                        ? "bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:bg-brand",
                                                    "rounded-md px-3 py-2 text-sm font-medium"
                                                )}
                                                aria-current={
                                                    currentPath === item.href
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {authenticated ? (
                                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
                                        <div className="group block w-full flex-shrink-0">
                                            <div className="flex items-center">
                                                <AvatarMenu
                                                    username={
                                                        session.user.name!
                                                    }
                                                    avatar={session.user.image}
                                                />
                                                <div className="ml-3 flex">
                                                    <p className="mt-[5px] hidden text-sm font-medium text-gray-700 dark:text-white md:block">
                                                        {session?.user.name}
                                                    </p>
                                                    <DarkModeSwitch />
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
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden ">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        currentPath === item.href
                                            ? "text-gray-90 bg-brand-white dark:bg-brand"
                                            : "text-black hover:bg-brand-white dark:text-white dark:hover:bg-brand",
                                        "block rounded-md px-3 py-2 text-base font-medium"
                                    )}
                                    aria-current={
                                        currentPath === item.href
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {item.name}
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
