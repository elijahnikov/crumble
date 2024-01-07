import FavouriteMovies from "./FavouriteMoviesCard";
import RecentActivityCard from "./RecentActivityCard";
import RecentlyWatched from "./RecentlyWatchedCard";
import RecentListsCard from "./RecentListsCard";
import RecentReviewsCard from "./RecentReviewsCard";
import { type TabProps } from "../../MainUserInformation";
import clxsm from "@/utils/clsxm";

const ProfileTab = (props: TabProps) => {
    const { isMobile } = props;
    return (
        <div className="w-full">
            <div className="flex">
                <div
                    className={clxsm(
                        isMobile ? "w-[60%]" : "w-[70%]",
                        "px-4 pt-2"
                    )}
                >
                    <FavouriteMovies {...props} />
                    <div className="h-[20px]" />
                    <RecentlyWatched {...props} />
                    <div className="h-[20px]" />
                    {!isMobile && <RecentReviewsCard {...props} />}
                </div>
                <div className="w-[2%]" />
                <div
                    className={clxsm(
                        isMobile ? "w-[40%]" : "w-[30%]",
                        "px-4 pt-2"
                    )}
                >
                    <RecentActivityCard {...props} />
                    <div className="h-[40px]" />
                    <RecentListsCard {...props} />
                </div>
            </div>
            {isMobile && <RecentReviewsCard {...props} />}
        </div>
    );
};

export default ProfileTab;
