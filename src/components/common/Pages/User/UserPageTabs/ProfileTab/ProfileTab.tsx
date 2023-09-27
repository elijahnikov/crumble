import { type RouterOutputs } from "@/utils/api";
import FavouriteMovies from "./FavouriteMoviesCard";
import RecentActivityCard from "./RecentActivityCard";
import RecentlyWatched from "./RecentlyWatchedCard";
import RecentListsCard from "./RecentListsCard";

const ProfileTab = ({
    user,
    isMe,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe: boolean;
}) => {
    return (
        <div className="w-full">
            <div className="flex">
                <div className="w-[70%] px-4 pt-2">
                    <FavouriteMovies user={user} isMe={isMe} />
                    <div className="h-[20px]" />
                    <RecentlyWatched user={user} isMe={isMe} />
                    <div className="h-[20px]" />
                    <RecentlyWatched user={user} isMe={isMe} />
                </div>
                <div className="w-[30%] px-4 pt-2">
                    <RecentActivityCard user={user} />
                    <div className="h-[40px]" />
                    <RecentListsCard user={user} />
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
