import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { type RouterOutputs, api } from "@/utils/api";
import InfiniteScroll from "react-infinite-scroll-component";
import FavouriteMovieActivity from "./Activities/FavouriteMovieActivity";
import ListEntryActivity from "./Activities/ListEntryActivity";
import ReviewActivity from "./Activities/ReviewActivity";
import WatchedActivity from "./Activities/WatchedActivity";

const ActivityTab = ({
    user,
    isMe,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe: boolean;
}) => {
    const { data, isError, isInitialLoading, fetchNextPage, hasNextPage } =
        api.activity.getActivityForUser.useInfiniteQuery(
            {
                username: user.name!,
                limit: 10,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );

    if (isError) {
        return <div>Error...</div>;
    }

    if (isInitialLoading) {
        return (
            <div className="mx-auto mt-10 flex w-full justify-center">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    const activities = data?.pages.flatMap((page) => page.activities);

    if (!activities || activities.length === 0) {
        return (
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400">
                No activity recorded for {user.name}
            </p>
        );
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={activities.length}
                next={fetchNextPage}
                hasMore={hasNextPage!}
                loader={
                    <div className="mx-auto mt-10 flex w-full justify-center">
                        <LoadingSpinner size={40} />
                    </div>
                }
                height={"100%"}
            >
                {activities.map((activity) => (
                    <div key={activity.id}>
                        {activity.favouriteMovie && (
                            <FavouriteMovieActivity small activity={activity} />
                        )}
                        {activity.watched && (
                            <WatchedActivity small activity={activity} />
                        )}
                        {activity.listEntry && (
                            <ListEntryActivity activity={activity} small />
                        )}
                        {activity.review && (
                            <ReviewActivity activity={activity} small />
                        )}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default ActivityTab;
