import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { api, type RouterOutputs } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";

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
            <div>
                <Select
                    size="sm"
                    value={"sortBySelection"}
                    setValue={() => "void"}
                >
                    <Select.Item size="sm" value="Newest">
                        Newest
                    </Select.Item>
                    <Select.Item size="sm" value="Top">
                        Top
                    </Select.Item>
                    <Select.Item size="sm" value="Controversial">
                        Controversial
                    </Select.Item>
                </Select>
            </div>
            <div className="mt-5 grid w-full grid-cols-8 gap-3">
                {watched.map((movie) => (
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
                                alt={`${movie.movieTitle}`}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                            />
                        </Link>
                        <div className="mt-[-15px]">
                            {movie.ratingGiven ? (
                                <Rating
                                    className="relative w-[100%] flex-shrink"
                                    emptyStyle={{ display: "flex" }}
                                    fillStyle={{
                                        display: "-webkit-inline-box",
                                    }}
                                    readonly
                                    allowFraction={true}
                                    initialValue={movie.ratingGiven}
                                    size={14}
                                    fillColor="#EF4444"
                                />
                            ) : null}
                        </div>
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
