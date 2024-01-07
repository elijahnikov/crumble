import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/Tabs/Tabs";
import ProfileTab from "./UserPageTabs/ProfileTab/ProfileTab";
import type { RouterOutputs } from "@/utils/api";
import ActivityTab from "./UserPageTabs/ActivityTab/ActivityTab";
import MoviesTab from "./UserPageTabs/MoviesTab/MoviesTab";
import DiaryTab from "./UserPageTabs/DiaryTab/DiaryTab";
import WatchlistTab from "./UserPageTabs/WatchlistTab/WatchlistTab";
import ReviewsTab from "./UserPageTabs/ReviewsTab/ReviewsTab";
import ListsTab from "./UserPageTabs/ListsTab/ListsTab";
import useIsMobile from "@/utils/hooks/useIsMobile";

export interface TabProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe?: boolean;
    isMobile: boolean;
}

const MainUserInformation = ({
    tabView,
    routeChange,
    user,
    isMe,
}: {
    tabView: string;
    routeChange: (route: string) => void;
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe: boolean;
}) => {
    const isMobile = useIsMobile(639);

    const propsObject = {
        user,
        isMe,
        isMobile,
    };
    return (
        <h1>
            <Tabs
                onValueChange={routeChange}
                value={tabView}
                className="w-[100%]"
            >
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-7">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="movies">Movies</TabsTrigger>
                    <TabsTrigger value="diary">Diary</TabsTrigger>
                    <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="lists">Lists</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileTab {...propsObject} />
                </TabsContent>
                <TabsContent value="activity">
                    <ActivityTab {...propsObject} />
                </TabsContent>
                <TabsContent value="movies">
                    <MoviesTab {...propsObject} />
                </TabsContent>
                <TabsContent value="diary">
                    <DiaryTab {...propsObject} />
                </TabsContent>
                <TabsContent value="watchlist">
                    <WatchlistTab {...propsObject} />
                </TabsContent>
                <TabsContent value="reviews">
                    <ReviewsTab {...propsObject} />
                </TabsContent>
                <TabsContent value="lists">
                    <ListsTab {...propsObject} />
                </TabsContent>
            </Tabs>
        </h1>
    );
};

export default MainUserInformation;
