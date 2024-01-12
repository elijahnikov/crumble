import { type RouterOutputs, api } from "@/utils/api";
import { Popover } from "@headlessui/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import clxsm from "@/utils/clsxm";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useIsMobile from "@/utils/hooks/useIsMobile";
import { Bell } from "lucide-react";

const notificationTypesMap = {
    follow: "followed you",
    reviewLike: (movie?: string) => `liked your review for ${movie}`,
    reviewComment: (movie?: string) => `commented on your review for ${movie}`,
};

const Notifications = () => {
    const isMobile = useIsMobile(1023);
    const trpcUtils = api.useContext();

    const [hasUnread, setHasUnread] = useState<boolean>(false);
    const {
        data: data,
        fetchNextPage,
        hasNextPage,
    } = api.notifications.getNotifications.useInfiniteQuery(
        {
            limit: 5,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

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

    const notifications = data?.pages.flatMap((page) => page.notifications);

    useEffect(() => {
        const hasReadTrue =
            data &&
            data.pages
                .flatMap((page) => page.notifications)
                .some((obj) => obj.read === false);
        setHasUnread(hasReadTrue ? hasReadTrue : false);
    }, [data]);

    if (!notifications) {
        return null;
    }

    return (
        <div id="test" className="relative mt-[6px] rounded-md">
            <Popover className="relative">
                <Popover.Button>
                    <div className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-slate-100 active:bg-slate-200 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-800">
                        <Bell width={18} />
                        {hasUnread && (
                            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-crumble" />
                        )}
                    </div>
                </Popover.Button>

                <Popover.Panel
                    className={clxsm(
                        notifications && notifications.length > 0
                            ? "max-h-[300px] min-h-[300px]"
                            : "max-h-[100px] min-h-[100px]",
                        isMobile
                            ? "absolute right-0 top-12"
                            : "absolute bottom-10",
                        "absolute  z-10  w-[280px] overflow-y-auto rounded-lg border bg-white p-2 dark:border-slate-700 dark:bg-brand-light"
                    )}
                >
                    {notifications && notifications.length > 0 && (
                        <p
                            onClick={() => clearAll()}
                            className="cursor-pointer pb-2 text-center text-xs text-crumble"
                        >
                            Clear all
                        </p>
                    )}
                    <InfiniteScroll
                        dataLength={notifications.length}
                        next={fetchNextPage}
                        hasMore={hasNextPage!}
                        loader={
                            <div className="flex w-full justify-center text-center">
                                <LoadingSpinner size={30} />
                            </div>
                        }
                        height="250px"
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <NotificationEntry
                                    setAsRead={setAsRead}
                                    key={index}
                                    notification={notification}
                                />
                            ))
                        ) : (
                            <div className="mx-auto mt-8 text-center">
                                <p className="text-sm">You are up to date.</p>
                            </div>
                        )}
                    </InfiniteScroll>
                </Popover.Panel>
            </Popover>
        </div>
    );
};

const NotificationEntry = ({
    notification,
    setAsRead,
}: {
    notification: RouterOutputs["notifications"]["getNotifications"]["notifications"][number];
    setAsRead: ({ id }: { id: string }) => void;
}) => {
    const notificationType =
        notificationTypesMap[
            notification.type as keyof typeof notificationTypesMap
        ];
    const result =
        typeof notificationType === "function" ? (
            <span>{notificationType(notification.review?.movieTitle)}</span>
        ) : (
            <span>{notificationType}</span>
        );
    return (
        <div
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
                    className="hover:underline"
                    href="/[username]/profile"
                    as={`/@${notification.notifier.name}/profile`}
                >
                    <span className="font-semibold  dark:text-slate-200">
                        @{notification.notifier.name}
                    </span>
                </Link>{" "}
                has {result}
            </p>
        </div>
    );
};

export default Notifications;
