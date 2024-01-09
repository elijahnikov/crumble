import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { type TabProps } from "../../MainUserInformation";

const WatchlistTab = ({ user }: TabProps) => {
    const {
        data: movies,
        isInitialLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = api.watchlist.watchlist.useInfiniteQuery(
        {
            username: user.name!,
            limit: 32,
            sortBy: undefined,
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

    const watchlist = movies?.pages.flatMap((page) => page.watchlist);

    if (!watchlist || watchlist.length === 0) {
        return (
            <div className="w-full text-center">
                <p className="mt-5 text-sm font-normal text-slate-600 dark:text-slate-400">
                    {user.name} has not watchlisted any movies just yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p className="mt-5 text-sm font-normal text-slate-500 dark:text-slate-400">
                <span className="font-bold text-black dark:text-white">
                    {user.name}
                </span>{" "}
                wants to watch{" "}
                <span className="font-bold text-black dark:text-white">
                    {movies?.pages[0]?.length}
                </span>{" "}
                movies
            </p>
            <div className="mt-2 grid w-full grid-cols-4 gap-3 border-t-[1px] py-2 dark:border-slate-700 sm:grid-cols-8">
                {watchlist.map((movie) => (
                    <div key={movie.id} className="w-[100%]">
                        <Link
                            href={{
                                pathname: "/movie/[id]",
                                query: {
                                    id: movie.movieId,
                                },
                            }}
                        >
                            <Image
                                className="rounded-md"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}
                                alt={`${movie.movie.title}`}
                                src={`https://image.tmdb.org/t/p/w500${movie.movie.poster}`}
                            />
                        </Link>
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
        </div>
    );
};

export default WatchlistTab;
