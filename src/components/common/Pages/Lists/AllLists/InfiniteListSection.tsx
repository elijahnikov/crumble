import InfiniteScroll from "react-infinite-scroll-component";
import SingleList from "./SingleList";

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
    toggleLike: (variables: { id: string }) => void;
    lists?: List[];
}

const InfiniteListSection = ({
    fetchNewLists,
    isError,
    isLoading,
    lists,
    toggleLike,
    hasMore,
}: InfiniteListSectionProps) => {
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
                            toggleLike={toggleLike}
                        />
                    ))}
            </InfiniteScroll>
        </>
    );
};

export default InfiniteListSection;
