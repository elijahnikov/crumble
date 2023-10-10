import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/ui/Button/Button";
import { api, type RouterOutputs } from "@/utils/api";
import Image from "next/image";

const MoviesTab = ({
    user,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}) => {
    const {
        data: movies,
        isInitialLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = api.watched.watched.useInfiniteQuery(
        {
            username: user.name!,
            limit: 32,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    if (isError) {
        return <div>Error...</div>;
    }

    if (isInitialLoading) {
        return (
            <div className="mx-auto mt-10 flex w-full justify-center">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    const watched = movies?.pages.flatMap((page) => page.watched);

    if (!watched || watched.length === 0) {
        return (
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400">
                {user.name} has not watched any movies just yet.
            </p>
        );
    }
    return (
        <>
            <div className="mt-5 grid w-full grid-cols-8 gap-3">
                {watched.map((movie) => (
                    <div key={movie.id}>
                        <Image
                            className="rounded-md"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                            alt={`${movie.movieTitle}`}
                            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                        />
                    </div>
                ))}
            </div>
            {hasNextPage && (
                <div className="mx-auto mt-5 flex w-full justify-center">
                    <Button
                        onClick={() => void fetchNextPage()}
                        loading={isFetchingNextPage}
                        size={"sm"}
                    >
                        More
                    </Button>
                </div>
            )}
        </>
    );
};

export default MoviesTab;
