import { api } from "@/utils/api";
import { Popover } from "@headlessui/react";
import { useEffect, useState } from "react";
import { BsBellFill, BsX } from "react-icons/bs";
import Image from "next/image";
import clxsm from "@/utils/clsxm";
import Link from "next/link";

const Notifications = () => {
    const trpcUtils = api.useContext();

    const [hasUnread, setHasUnread] = useState<boolean>(false);
    const { data: notifications } =
        api.notifications.getNotifications.useQuery();

    const { mutate: setAsRead } = api.notifications.setRead.useMutation({
        onSuccess: async () => {
            await trpcUtils.notifications.getNotifications.invalidate();
        },
    });

    const { mutate: clearAll } = api.notifications.clearAll.useMutation({
        onSuccess: async () => {
            await trpcUtils.notifications.getNotifications.invalidate();
        },
    });

    useEffect(() => {
        const hasReadTrue =
            notifications && notifications.some((obj) => obj.read === false);
        setHasUnread(hasReadTrue ? hasReadTrue : false);
    }, [notifications]);
    return (
        <div className="relative ml-2 ml-4 mt-[6px] hidden rounded-md md:block">
            <Popover className="relative">
                <Popover.Button>
                    <>
                        <BsBellFill />
                        {hasUnread && (
                            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-crumble" />
                        )}
                    </>
                </Popover.Button>

                <Popover.Panel className=" absolute bottom-10 z-10 max-h-[300px] min-h-[300px] w-[280px] overflow-y-auto rounded-lg border bg-white p-2 dark:border-slate-700 dark:bg-brand-light">
                    <p
                        onClick={() => clearAll()}
                        className="cursor-pointer pb-2 text-center text-xs text-crumble"
                    >
                        Clear all
                    </p>
                    {notifications?.map((notification, index) => (
                        <div
                            key={index}
                            onClick={() =>
                                setAsRead({
                                    id: notification.id,
                                })
                            }
                            className={clxsm(
                                !notification.read
                                    ? "cursor-pointer bg-brand-light"
                                    : "bg-brand",
                                "mb-2 flex space-x-2 rounded-lg border p-2 dark:border-slate-700"
                            )}
                        >
                            <div className="my-auto">
                                {notification.notifier.image && (
                                    <Image
                                        src={notification.notifier.image}
                                        className="rounded-full"
                                        width={30}
                                        height={30}
                                        alt="profile picture"
                                    />
                                )}
                            </div>
                            <p className="my-auto w-full text-sm dark:text-slate-400">
                                <Link
                                    href="/[username]/profile"
                                    as={`/@${notification.notifier.name}/profile`}
                                >
                                    <span className="font-semibold  dark:text-slate-200">
                                        @{notification.notifier.name}
                                    </span>
                                </Link>{" "}
                                has{" "}
                                {notification.type === "test" && "followed you"}
                            </p>
                        </div>
                    ))}
                </Popover.Panel>
            </Popover>
        </div>
    );
};

export default Notifications;
