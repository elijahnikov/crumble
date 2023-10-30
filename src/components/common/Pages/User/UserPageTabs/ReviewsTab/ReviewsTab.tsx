import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import Link from "next/link";

import Button from "@/components/ui/Button/Button";
import { useEffect, useState } from "react";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";
import { Select } from "@/components/ui/Select/Select";

const sortToKeyMap: Record<
    string,
    { key: string; direction: "desc" | "asc" | undefined }
> = {
    Top: { key: "reviewLikes", direction: "desc" },
    Newest: { key: "createdAt", direction: "desc" },
    Controversial: { key: "reviewLikes", direction: "asc" },
};

const filterMap = {
    duration: ["1 day", "1 week", "30 days", "6 months", "1 year", "ALl time"],
    sortBy: ["Newest", "Top", "Controversial"],
};

const ReviewsTab = ({
    user,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}) => {
    const [selectedDurationSort, setSelectedDurationSort] =
        useState<string>("30 days");
    const [sortBySelection, setSortBySelection] = useState<string>("Newest");

    const {
        data: movies,
        isInitialLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = api.review.reviews.useInfiniteQuery(
        {
            username: user.name!,
            limit: 10,
            orderBy: sortToKeyMap[sortBySelection]?.key,
            dateSortBy: getDatesToSortBy(selectedDurationSort),
            orderDirection: sortToKeyMap[sortBySelection]?.direction,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    useEffect(() => {
        getDatesToSortBy(selectedDurationSort);
    }, [selectedDurationSort]);

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

    const reviews = movies?.pages.flatMap((page) => page.reviews);

    if (!reviews || reviews.length === 0) {
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
            <div className="float-right mb-2">
                {(sortBySelection === "Top" ||
                    sortBySelection === "Controversial") && (
                    <Select
                        size="sm"
                        value={selectedDurationSort}
                        setValue={setSelectedDurationSort}
                    >
                        {filterMap.duration.map((filter, index) => (
                            <Select.Item size="sm" key={index} value={filter}>
                                {filter}
                            </Select.Item>
                        ))}
                    </Select>
                )}
                <Select
                    value={sortBySelection}
                    setValue={setSortBySelection}
                    size="sm"
                >
                    {filterMap.sortBy.map((filter, index) => (
                        <Select.Item key={index} size="sm" value={filter}>
                            {filter}
                        </Select.Item>
                    ))}
                </Select>
            </div>
            <div className="mt-2 grid  w-full grid-cols-8 gap-3 border-t-[1px] py-2 dark:border-slate-700">
                {reviews.map((movie) => (
                    <div key={movie.id} className="w-[100%]">
                        <Link
                            href={{
                                pathname: "/movie/[id]",
                                query: {
                                    id: movie.movieId,
                                },
                            }}
                        ></Link>
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

export default ReviewsTab;
