import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/ui/Button/Button";
import { Select } from "@/components/ui/Select/Select";
import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { type TabProps } from "../../MainUserInformation";

const sortByMap: Array<{ label: string; dataName: string }> = [
    {
        label: "Movie Name",
        dataName: "movieName",
    },
    {
        label: "Recently Added",
        dataName: "recentlyAdded",
    },
    {
        label: "Release Date",
        dataName: "releaseDate",
    },
    {
        label: "Average Rating",
        dataName: "averageRating",
    },
];

const MoviesTab = ({ user }: TabProps) => {
    const [sortBy, setSortBy] = useState<string>(sortByMap[1]!.label);

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
            sortBy:
                sortByMap.find((sort) => sort.label === sortBy)?.dataName ??
                undefined,
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
            <div className="w-full text-center">
                <p className="mt-5 text-sm font-normal text-slate-600 dark:text-slate-400">
                    {user.name} has not watched any movies just yet.
                </p>
            </div>
        );
    }
    return (
        <div>
            <div className="float-right mb-2">
                <Select size="sm" value={sortBy} setValue={setSortBy}>
                    {sortByMap.map((sort) => (
                        <Select.Item
                            size="sm"
                            key={sort.dataName}
                            value={sort.label}
                        >
                            {sort.label}
                        </Select.Item>
                    ))}
                </Select>
            </div>

            <div className="mt-5 grid w-full grid-cols-4 gap-3 border-t-[1px] py-2 dark:border-slate-700 md:grid-cols-8">
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
                        {movie.ratingGiven ? (
                            <div className="mt-[-10px] md:mt-[-15px]">
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
                            </div>
                        ) : null}
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

export default MoviesTab;
