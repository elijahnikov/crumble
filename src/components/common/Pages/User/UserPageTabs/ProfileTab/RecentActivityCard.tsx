import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import FavouriteMovieActivity from "../ActivityTab/Activities/FavouriteMovieActivity";
import WatchedActivity from "../ActivityTab/Activities/WatchedActivity";
import ListEntryActivity from "../ActivityTab/Activities/ListEntryActivity";
import ReviewActivity from "../ActivityTab/Activities/ReviewActivity";
import Link from "next/link";
import ReviewLikeActivity from "../ActivityTab/Activities/ReviewLikeActivity";

interface RecentActivityCardProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

const RecentActivityCard = ({ user }: RecentActivityCardProps) => {
    const { data, isLoading } = api.activity.getActivityForUser.useQuery({
        username: user.name!,
        limit: 5,
    });

    return (
        <div>
            <div className="flex">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Recent activity
                </p>
                <Link
                    href="/[username]/activity"
                    as={`/@${user.name}/activity`}
                >
                    <p className="ml-4 mt-[2px] flex cursor-pointer text-xs font-normal text-crumble underline">
                        See more
                    </p>
                </Link>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />
            <div>
                <div className="mx-auto flex justify-center pt-2 text-center">
                    {isLoading && <LoadingSpinner size={30} />}
                </div>
                {data && (
                    <div>
                        {data.activities.length > 0 ? (
                            <div>
                                {data.activities.map((activity) => (
                                    <div className="mb-3" key={activity.id}>
                                        {activity.favouriteMovie && (
                                            <FavouriteMovieActivity
                                                activity={activity}
                                            />
                                        )}
                                        {activity.watched && (
                                            <WatchedActivity
                                                activity={activity}
                                            />
                                        )}
                                        {activity.listEntry && (
                                            <ListEntryActivity
                                                activity={activity}
                                            />
                                        )}
                                        {activity.review &&
                                            !activity.reviewLike && (
                                                <ReviewActivity
                                                    activity={activity}
                                                />
                                            )}
                                        {activity.reviewLike &&
                                            activity.review && (
                                                <ReviewLikeActivity
                                                    activity={activity}
                                                />
                                            )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm font-normal text-slate-600 dark:text-slate-400">
                                No activity recorded for {user.name}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivityCard;
