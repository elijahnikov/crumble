import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import FavouriteMovieActivity from "../ActivityTab/Activities/FavouriteMovieActivity";
import WatchedActivity from "../ActivityTab/Activities/WatchedActivity";
import ListEntryActivity from "../ActivityTab/Activities/ListEntryActivity";
import ReviewActivity from "../ActivityTab/Activities/ReviewActivity";

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
                <p className="w-[82%] text-sm text-slate-600 dark:text-slate-300">
                    Recent Activity
                </p>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />
            <div>
                <div className="mx-auto flex justify-center pt-2 text-center">
                    {isLoading && <LoadingSpinner />}
                </div>
                {data && (
                    <div>
                        {data.activities.length > 0 ? (
                            <div className="space-y-3">
                                {data.activities.map((activity) => (
                                    <div key={activity.id}>
                                        {activity.favouriteMovie && (
                                            <FavouriteMovieActivity
                                                small
                                                activity={activity}
                                            />
                                        )}
                                        {activity.watched && (
                                            <WatchedActivity
                                                small
                                                activity={activity}
                                            />
                                        )}
                                        {activity.listEntry && (
                                            <ListEntryActivity
                                                activity={activity}
                                                small
                                            />
                                        )}
                                        {activity.review && (
                                            <ReviewActivity
                                                activity={activity}
                                                small
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No activity recorded.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivityCard;
