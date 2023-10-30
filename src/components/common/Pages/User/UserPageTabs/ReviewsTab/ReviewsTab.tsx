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
import { BiSolidComment } from "react-icons/bi";

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

const ReviewRow = ({ review }: ReviewRow) => {
    return (
        <div className="mt-5 w-full px-5">
            <div className="flex space-x-5">
                <div>
                    <Link href="/review/[id]/" as={`/review/${review.id}`}>
                        <Image
                            alt={review.movieTitle}
                            src={`https://image.tmdb.org/t/p/original${review.moviePoster}`}
                            width={100}
                            height={100}
                            className="rounded-md"
                        />
                    </Link>
                </div>
                <div>
                    <div className="flex">
                        <div>
                            {review.user.image && (
                                <Image
                                    alt={review.user.name!}
                                    src={review.user.image}
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                            )}
                        </div>
                        <p className="ml-2 mt-1 text-sm font-semibold">
                            <span className="text-slate-600 dark:text-slate-300">
                                Review by{" "}
                            </span>
                            <span className="underline">
                                {review.user.name}
                            </span>
                        </p>
                        <Rating
                            className="-mt-[18px] ml-3"
                            emptyStyle={{ display: "flex" }}
                            fillStyle={{
                                display: "-webkit-inline-box",
                            }}
                            readonly
                            allowFraction={true}
                            initialValue={review.ratingGiven}
                            size={15}
                            fillColor="#EF4444"
                        />
                    </div>
                    <div>
                        <div className="text-[16px] font-semibold text-slate-700 dark:text-slate-200 dark:text-slate-200">
                            {review.text}
                        </div>
                        <div className=" mb-2 mt-10 flex space-x-4">
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
                                    {review._count.reviewLikes}
                                </p>
                            </div>
                            <div className="flex space-x-1 text-xs">
                                <BiSolidComment
                                    className={clxsm(
                                        "dark-fill-slate-400 mt-[3px] fill-slate-600"
                                    )}
                                />
                                <p className="dark:text-slate-400">
                                    {review._count.reviewComments}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="mx-auto mt-5 w-full border-gray-200 dark:border-gray-700" />
        </div>
    );
};
