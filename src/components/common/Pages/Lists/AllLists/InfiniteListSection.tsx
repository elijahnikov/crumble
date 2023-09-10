import InfiniteScroll from "react-infinite-scroll-component";
import SingleList from "./SingleList";
import { api } from "@/utils/api";

export interface List {
    user: {
        id: string;
        name: string | null;
        displayName: string | null;
        image: string | null;
    };
    likeCount: number;
    commentCount: number;
    likedByMe: boolean;
    createdAt: Date;
    title: string;
    description: string | null;
    numberOfFilms: number;
    id: string;
    listEntries: Array<{
        id: string;
        listId: string;
        movieId: number;
        movie: {
            movieId: number;
            title: string;
            poster: string | null;
        };
    }>;
}

interface InfiniteListSectionProps {
    isLoading: boolean;
    isError: boolean;
    hasMore?: boolean;
    fetchNewLists: () => Promise<unknown>;
    lists?: List[];
}

const InfiniteListSection = ({
    fetchNewLists,
    isError,
    isLoading,
    lists,
    hasMore,
}: InfiniteListSectionProps) => {
    const trpcUtils = api.useContext();

    const { mutate } = api.list.toggleListLike.useMutation({
        onSuccess: async () => {
            await trpcUtils.list.lists.invalidate();
        },
    });

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error...</div>;

    if (lists === null || typeof lists === "undefined") return null;

    return (
        <>
            <InfiniteScroll
                dataLength={lists.length}
                next={fetchNewLists}
                hasMore={hasMore!}
                loader={"Loading..."}
            >
                {lists.length > 0 &&
                    lists.map((list) => (
                        <SingleList
                            key={list.id}
                            list={list}
                            toggleLike={mutate}
                        />
                    ))}
            </InfiniteScroll>
        </>
    );
};

export default InfiniteListSection;
