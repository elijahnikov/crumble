import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/Tabs/Tabs";
import ProfileTab from "./UserPageTabs/ProfileTab";

const MainUserInformation = ({
    tabView,
    routeChange,
}: {
    tabView: string;
    routeChange: (route: string) => void;
}) => {
    return (
        <h1>
            <Tabs
                onValueChange={routeChange}
                value={tabView}
                className="w-[100%]"
            >
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="movies">Movies</TabsTrigger>
                    <TabsTrigger value="diary">Diary</TabsTrigger>
                    <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileTab />
                </TabsContent>
                <TabsContent value="activity">
                    <h1>Activity</h1>
                </TabsContent>
                <TabsContent value="movies">
                    <h1>Movies</h1>
                </TabsContent>
                <TabsContent value="diary">
                    <h1>Diary</h1>
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
