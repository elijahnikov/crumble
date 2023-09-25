import { api, type RouterOutputs } from "@/utils/api";
import FavouriteMovies from "./FavouriteMovies";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import RecentActivityCard from "./RecentActivityCard";

const ProfileTab = ({
    user,
    isMe,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe: boolean;
}) => {
    const { data: favouriteMovies, isLoading: favouriteMoviesLoading } =
        api.user.getFavouriteMoviesForUser.useQuery({
            username: user.name!,
        });

    return (
        <div className="w-full">
            <div className="flex">
                <div className="w-[70%] px-4 pt-2">
                    {favouriteMoviesLoading ? (
                        <LoadingSpinner />
                    ) : (
                        favouriteMovies &&
                        (isMe || favouriteMovies.length > 0) && (
                            <FavouriteMovies
                                data={favouriteMovies}
                                user={user}
                                isMe={isMe}
                            />
                        )
                    )}
                    <div className="h-[20px]" />
                    <RecentActivityCard user={user} />
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
