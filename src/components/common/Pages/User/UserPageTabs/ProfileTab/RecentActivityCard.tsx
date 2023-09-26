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
        specificActivity: ["favouriteMovie", "watched", "review", "listEntry"],
        limit: 5,
    });
    console.log(data);

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
                                                username={user.name!}
                                                createdAt={activity.createdAt}
                                                movieTitle={
                                                    activity.favouriteMovie
                                                        .movie.title
                                                }
                                            />
                                        )}
                                        {activity.watched && (
                                            <WatchedActivity
                                                username={user.name!}
                                                createdAt={activity.createdAt}
                                                small
                                                movieTitle={
                                                    activity.watched.movieTitle
                                                }
                                            />
                                        )}
                                        {activity.listEntry && (
                                            <ListEntryActivity
                                                username={user.name!}
                                                createdAt={activity.createdAt}
                                                small
                                                movieTitle={
                                                    activity.listEntry.movie
                                                        .title
                                                }
                                                listTitle={
                                                    activity.listEntry.list
                                                        .title
                                                }
                                            />
                                        )}
                                        {activity.review && (
                                            <ReviewActivity
                                                username={user.name!}
                                                createdAt={activity.createdAt}
                                                small
                                                movieTitle={
                                                    activity.review.movieTitle
                                                }
                                                rating={
                                                    activity.review.ratingGiven
                                                }
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
