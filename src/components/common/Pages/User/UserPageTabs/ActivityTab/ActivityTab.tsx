import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import FavouriteMovieActivity from "./Activities/FavouriteMovieActivity";
import ListEntryActivity from "./Activities/ListEntryActivity";
import ReviewActivity from "./Activities/ReviewActivity";
import WatchedActivity from "./Activities/WatchedActivity";
import Button from "@/components/ui/Button/Button";
import ReviewLikeActivity from "./Activities/ReviewLikeActivity";
import { type TabProps } from "../../MainUserInformation";
import ListCreateActivity from "./Activities/ListCreateActivity";
import WatchlistActivity from "./Activities/WatchlistActivity";

const ActivityTab = ({ user }: TabProps) => {
    const {
        data,
        isError,
        isInitialLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = api.activity.getActivityForUser.useInfiniteQuery(
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
        <div className="mt-5">
            {activities.map((activity) => (
                <div key={activity.id}>
                    {activity.favouriteMovie && (
                        <FavouriteMovieActivity activity={activity} />
                    )}
                    {activity.watched && (
                        <WatchedActivity activity={activity} />
                    )}
                    {activity.listEntry && (
                        <ListEntryActivity activity={activity} />
                    )}
                    {activity.list && (
                        <ListCreateActivity activity={activity} />
                    )}
                    {activity.review && !activity.reviewLike && (
                        <ReviewActivity card={false} activity={activity} />
                    )}
                    {activity.reviewLike && activity.review && (
                        <ReviewLikeActivity activity={activity} />
                    )}
                    {activity.watchlist && (
                        <WatchlistActivity activity={activity} />
                    )}
                    <hr className="my-4 dark:border-slate-700" />
                </div>
            ))}
            {hasNextPage && (
                <div className="mx-auto flex w-full justify-center">
                    <Button
                        onClick={() => void fetchNextPage()}
                        loading={isFetchingNextPage}
                        size={"sm"}
                    >
                        More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ActivityTab;
