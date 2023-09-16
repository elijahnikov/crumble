import clxsm from "@/utils/clsxm";
import navigation from "@/utils/data/navLinks";
import { Disclosure, Menu, Transition } from "@headlessui/react";

import { Fragment } from "react";
import { BiMenu } from "react-icons/bi";

const MobileNavMenu = ({ currentPath }: { currentPath: string }) => {
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
                        <BiMenu
                            className={clxsm(
                                "dark:fill-white",
                                "h-6  w-6 text-brand"
                            )}
                            aria-hidden="true"
                        />
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
                    <div className="absolute space-y-1 rounded-md bg-brand px-2 pb-3 pt-2">
                        {navigation.map((item) => (
                            <Disclosure.Button
                                key={item.name}
                                as="a"
                                href={item.href}
                                className={clxsm(
                                    currentPath === item.href
                                        ? "bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-gray-900 dark:text-slate-400 hover:dark:text-slate-600",
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
                </Transition>
            </Menu>
        </>
    );
};

export default MobileNavMenu;
