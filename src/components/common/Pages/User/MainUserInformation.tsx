import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/Tabs/Tabs";

const MainUserInformation = () => {
    return (
        <h1>
            <Tabs defaultValue="profile" className="w-[100%]">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="movies">Movies</TabsTrigger>
                    <TabsTrigger value="diary">Diary</TabsTrigger>
                    <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
            </Tabs>
        </h1>
    );
};

export default MainUserInformation;
