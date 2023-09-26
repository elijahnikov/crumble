import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import FavouriteMovieActivity from "../ActivityTab/Activities/FavouriteMovieActivity";
import WatchedActivity from "../ActivityTab/Activities/WatchedActivity";

interface RecentActivityCardProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

type ActivityType = RouterOutputs["activity"]["getActivityForUser"];

const RecentActivityCard = ({ user }: RecentActivityCardProps) => {
    const { data, isLoading } = api.activity.getActivityForUser.useQuery({
        username: user.name!,
        specificActivity: ["favouriteMovie", "watched", "review", "listEntry"],
        limit: 5,
    });

    return (
        <div>
            <div className="flex">
                <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                    Recent Activity
                </p>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />
            <div>
                <div className="mx-auto flex justify-center pt-5 text-center">
                    {isLoading && <LoadingSpinner />}
                </div>
                {data && (
                    <div>
                        {data.activities.length > 0 ? (
                            <div>
                                {data.activities.map((activity) => (
                                    <div key={activity.id}>
                                        {activity.favouriteMovie && (
                                            <FavouriteMovieActivity
                                                small
                                                createdAt={activity.createdAt}
                                                movieTitle={
                                                    activity.favouriteMovie
                                                        .movie.title
                                                }
                                            />
                                        )}
                                        {activity.watched && (
                                            <WatchedActivity
                                                createdAt={activity.createdAt}
                                                small
                                                movieTitle={
                                                    activity.watched.movieTitle
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
