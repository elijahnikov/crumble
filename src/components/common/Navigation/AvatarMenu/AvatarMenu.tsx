import { PLACEHOLDER_USER_IMAGE_URL } from "@/constants";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const AvatarMenu = ({
    avatar,
    username,
}: {
    avatar: string | null | undefined;
    username: string;
}) => {
    return (
        <>
            <Menu as="div">
                <Menu.Button>
                    <Image
                        width={50}
                        height={50}
                        className="inline-block h-9 w-9 rounded-full"
                        src={avatar ?? PLACEHOLDER_USER_IMAGE_URL}
                        alt={"Profile picture"}
                    />
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
                    <Menu.Items className="right absolute bottom-[60px] mt-2 h-max w-40 divide-y divide-gray-700 rounded-md bg-brand ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                <Link
                                    href="/[username]"
                                    as={`/@${username}`}
                                    className={`group flex w-[100%] items-center rounded-md px-2 py-2 text-sm text-gray-200 hover:bg-brand-light`}
                                >
                                    Profile
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link
                                    href="/[username]/settings"
                                    as={`/@${username}/settings`}
                                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200 hover:bg-brand-light`}
                                >
                                    Settings
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <div
                                    onClick={() =>
                                        void signOut({ callbackUrl: "/" })
                                    }
                                    className={`group flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm text-crumble hover:bg-brand-light`}
                                >
                                    Sign out
                                </div>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
};

export default AvatarMenu;
