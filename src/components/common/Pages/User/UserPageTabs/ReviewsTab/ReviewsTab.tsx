import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { useEffect, useState } from "react";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";
import { Select } from "@/components/ui/Select/Select";
import { Rating } from "react-simple-star-rating";
import { BsHeartFill } from "react-icons/bs";
import clxsm from "@/utils/clsxm";
import { type TabProps } from "../../MainUserInformation";

const sortToKeyMap: Record<
    string,
    { key: string; direction: "desc" | "asc" | undefined }
> = {
    Top: { key: "reviewLikes", direction: "desc" },
    Newest: { key: "createdAt", direction: "desc" },
    Controversial: { key: "reviewLikes", direction: "asc" },
};

const filterMap = {
    duration: ["1 day", "1 week", "30 days", "6 months", "1 year", "All time"],
    sortBy: ["Newest", "Top", "Controversial"],
};

const ReviewsTab = ({ user }: TabProps) => {
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
            <div>
                <div className="mb-2 mt-2 flex space-x-2">
                    <div className="w-full" />
                    {(sortBySelection === "Top" ||
                        sortBySelection === "Controversial") && (
                        <Select
                            size="sm"
                            value={selectedDurationSort}
                            setValue={setSelectedDurationSort}
                        >
                            {filterMap.duration.map((filter, index) => (
                                <Select.Item
                                    size="sm"
                                    key={index}
                                    value={filter}
                                >
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
                <div className="w-full text-center">
                    <p className="mt-5 text-sm font-normal text-slate-600 dark:text-slate-400">
                        No reviews found for {user.name}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-2 mt-2 flex space-x-2">
                <div className="w-full" />
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
            <div className="mt-2 w-full gap-3 border-t-[1px] py-2 dark:border-slate-700">
                {reviews.map((review) => (
                    <ReviewRow review={review} key={review.id} />
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

interface ReviewRow {
    review: RouterOutputs["review"]["reviews"]["reviews"][0];
}

export const ReviewRow = ({ review }: ReviewRow) => {
    return (
        <div className="mt-5 w-full px-5">
            <div className="flex space-x-5">
                <div>
                    <Link href="/review/[id]/" as={`/review/${review.id}`}>
                        <Image
                            alt={review.movieTitle}
                            src={`https://image.tmdb.org/t/p/original${review.moviePoster}`}
                            width={80}
                            height={80}
                            className="rounded-md"
                        />
                    </Link>
                </div>
                <div>
                    <div>
                        <div className="flex">
                            <h4>{review.movieTitle}</h4>
                            <p className="-mt-[5px] ml-1 text-[18px] font-semibold text-slate-500 dark:text-slate-500">
                                {review.movieReleaseYear.slice(0, 4)}
                            </p>
                        </div>
                        <div className="-mt-2 flex">
                            <div className="mt-2">
                                {review.user.image && (
                                    <Image
                                        alt={review.user.name!}
                                        src={review.user.image}
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                    />
                                )}
                            </div>
                            <p className="ml-2 mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                                {review.user.name}
                            </p>
                            <Rating
                                className="-mt-[3px] ml-2"
                                emptyStyle={{ display: "flex" }}
                                fillStyle={{
                                    display: "-webkit-inline-box",
                                }}
                                readonly
                                allowFraction={true}
                                initialValue={review.ratingGiven}
                                size={12}
                                fillColor="#EF4444"
                            />
                        </div>
                    </div>
                    <div>
                        <div className=" text-[16px] font-semibold text-slate-700 dark:text-gray-400 dark:text-slate-300">
                            {review.text.length > 50
                                ? review.text.slice(0, 50) + "..."
                                : review.text}
                        </div>
                        <div className=" mb-2 mt-3 flex space-x-4">
                            <div className="flex space-x-1 text-xs">
                                <BsHeartFill
                                    className={clxsm(
                                        "mt-[3px]",
                                        review.likedByMe
                                            ? "fill-crumble"
                                            : "dark-fill-slate-400 fill-slate-600"
                                    )}
                                />
                                <p className="dark:text-slate-400">
                                    {review._count.reviewLikes} likes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="mx-auto mt-2 w-full border-gray-200 dark:border-gray-800" />
        </div>
    );
};
