import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BsBook, BsCardList, BsEye } from "react-icons/bs";
import { BiCameraMovie, BiCommentDetail } from "react-icons/bi";
import clxsm from "@/utils/clsxm";
import { useEffect, useState } from "react";

const navigation = [
    { name: "Films", icon: BiCameraMovie, href: "/films" },
    { name: "Diary", icon: BsBook, href: "/diary" },
    { name: "Reviews", icon: BiCommentDetail, href: "/reviews" },
    { name: "People", icon: BsEye, href: "/people" },
    { name: "Lists", icon: BsCardList, href: "/lists" },
];

const NavigationBar = () => {
    const [currentPath, setCurrentPath] = useState("");

    const router = useRouter();
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
                            src="https://i.ibb.co/r4WtSVc/supercrumble800x800.png"
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
                                currentPath === item.href
                                    ? "bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:bg-brand",
                                "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                            )}
                        >
                            {item.icon && (
                                <item.icon
                                    className={clxsm(
                                        currentPath === item.href
                                            ? "text-gray-500"
                                            : "text-white",
                                        "mr-3 h-6 w-6 flex-shrink-0"
                                    )}
                                    aria-hidden="true"
                                />
                            )}

                            <span className="flex-1">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            {authenticated && (
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
                    <div className="group block w-full flex-shrink-0">
                        <div className="flex items-center">
                            {session.user.image && (
                                <Image
                                    width={50}
                                    height={50}
                                    className="inline-block h-9 w-9 rounded-full"
                                    src={session.user.image}
                                    alt={"Profile picture"}
                                />
                            )}
                            <div className="ml-3 flex">
                                <p className="text-sm font-medium text-gray-700 dark:text-white">
                                    {session?.user.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavigationBar;
