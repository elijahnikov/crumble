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
    return (
        <h1>
            <Tabs
                onValueChange={routeChange}
                value={tabView}
                className="w-[100%]"
            >
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="movies">Movies</TabsTrigger>
                    <TabsTrigger value="diary">Diary</TabsTrigger>
                    <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="lists">Lists</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileTab user={user} isMe={isMe} />
                </TabsContent>
                <TabsContent value="activity">
                    <ActivityTab user={user} isMe={isMe} />
                </TabsContent>
                <TabsContent value="movies">
                    <MoviesTab user={user} />
                </TabsContent>
                <TabsContent value="diary">
                    <DiaryTab />
                </TabsContent>
                <TabsContent value="watchlist">
                    <h1>Watchlist</h1>
                </TabsContent>
                <TabsContent value="reviews">
                    <h1>Reviews</h1>
                </TabsContent>
            </Tabs>
        </h1>
    );
};

export default MainUserInformation;
