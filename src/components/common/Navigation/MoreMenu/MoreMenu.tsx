import clxsm from "@/utils/clsxm";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { BsThreeDots } from "react-icons/bs";

const MoreMenu = () => {
    return (
        <>
            <Menu as="div">
                <Menu.Button as="div">
                    <div
                        className={clxsm(
                            "cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:bg-brand",
                            "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                        )}
                    >
                        <BsThreeDots
                            className={clxsm(
                                "dark:fill-white",
                                "mr-3 h-6  w-6 text-brand"
                            )}
                            aria-hidden="true"
                        />
                        <span className="text-center">More</span>
                    </div>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="mt-2 w-40 divide-y divide-gray-700 rounded-md bg-brand ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                <Link
                                    href="/[username]/settings"
                                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200 hover:bg-brand-light`}
                                >
                                    Settings
                                </Link>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
};

export default MoreMenu;
