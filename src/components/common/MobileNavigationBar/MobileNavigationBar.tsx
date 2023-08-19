import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";
import { BiCameraMovie, BiCommentDetail } from "react-icons/bi";
import { BsBook, BsEye, BsCardList, BsArrowRightSquare } from "react-icons/bs";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";

const navigation = [
    { name: "Films", icon: BiCameraMovie, href: "/films" },
    { name: "Diary", icon: BsBook, href: "/diary" },
    { name: "Reviews", icon: BiCommentDetail, href: "/reviews" },
    { name: "People", icon: BsEye, href: "/people" },
    { name: "Lists", icon: BsCardList, href: "/lists" },
];

const MobileNavigationBar = () => {
    const [currentPath, setCurrentPath] = useState("");

    const router = useRouter();
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
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
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
                                    <div className="flex space-x-2">
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
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                            {session?.user.image && (
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    className="inline-block h-9 w-9 rounded-full"
                                                    src={session.user.image}
                                                    alt={"Profile picture"}
                                                />
                                            )}
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border-[1px] bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800 dark:bg-brand">
                                            <Menu.Item>
                                                <div className="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    {session?.user.name}
                                                </div>
                                            </Menu.Item>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <div
                                                        className={classNames(
                                                            active
                                                                ? "bg-brand-light"
                                                                : "",
                                                            "block flex cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white"
                                                        )}
                                                    >
                                                        Sign out
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        currentPath === item.href
                                            ? "bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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
