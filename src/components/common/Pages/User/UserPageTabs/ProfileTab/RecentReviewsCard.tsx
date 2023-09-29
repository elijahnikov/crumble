import { api, type RouterOutputs } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { Rating } from "react-simple-star-rating";
import { BsHeartFill } from "react-icons/bs";
import clxsm from "@/utils/clsxm";
import { shortMonthDateFormat } from "@/utils/general/dateFormat";

const RecentReviewsCard = ({
    user,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe?: boolean;
}) => {
    const { data: reviews, isLoading: recentlyWatchedLoading } =
        api.review.reviews.useQuery({
            limit: 5,
            orderBy: "watchedOn",
            orderDirection: "asc",
            username: user.name!,
        });

    if (recentlyWatchedLoading) {
        return (
            <div>
                <div className="flex">
                    <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                        Recently watched
                    </p>
                </div>
                <div className="border-b pt-1 dark:border-slate-500" />
                <div className="mt-5 flex justify-center">
                    <LoadingSpinner size={30} />
                </div>
            </div>
        );
    }

    if (!reviews) {
        return (
            <div className="flex">
                <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                    Recent Reviews
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Recent Reviews
                </p>
                <Link href="/[username]/reviews" as={`/@${user.name}/reviews`}>
                    <p className="ml-4 mt-[2px] flex cursor-pointer text-xs font-normal text-crumble underline">
                        See more
                    </p>
                </Link>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />

            {reviews.reviews.length === 0 ? (
                <p className="pt-1 text-sm font-normal">
                    {user.name} has not watched any movies recently
                </p>
            ) : (
                <div className="mt-2 h-max w-full">
                    {reviews.reviews.slice(0, 5).map((r) => (
                        <ReviewRow key={r.id} review={r} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ReviewRow = ({
    review,
}: {
    review: RouterOutputs["review"]["reviews"]["reviews"][0];
}) => {
    return (
        <>
            <div className="mt-5 flex">
                <div className=" cursor-pointer rounded-md border-[1px] border-gray-200 dark:border-brand-light">
                    {review.moviePoster ? (
                        <Link
                            href="/movie/[id]/"
                            as={`/movie/${review.movieId}`}
                        >
                            <Image
                                className="rounded-md"
                                width={80}
                                height={130}
                                alt={`${review.movieTitle}`}
                                src={`https://image.tmdb.org/t/p/w500${review.moviePoster}`}
                            />
                        </Link>
                    ) : (
                        <div className="mb-5 mt-5 text-center">?</div>
                    )}
                </div>
                <div className="ml-4 w-[80%]">
                    <Link href="/review/[id]/" as={`/review/${review.id}`}>
                        <div className="flex">
                            <h4 className="text-slate-700 dark:text-slate-200">
                                {review.movieTitle}
                                <span className="ml-2 mt-[10px] text-sm font-light text-crumble">
                                    {review.movieReleaseYear.slice(0, 4)}
                                </span>
                            </h4>
                        </div>
                    </Link>
                    <div className="mt-1 flex">
                        <Rating
                            className="-mt-7"
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
                        <p className="ml-2 mt-[3px] text-xs font-normal text-slate-500  dark:text-slate-200 dark:text-slate-400">
                            Watched on {shortMonthDateFormat(review.watchedOn!)}
                        </p>
                    </div>
                    <div>
                        <p className="text-md text-sm font-semibold text-slate-700 dark:text-slate-200 dark:text-slate-200">
                            {review.text.length > 150
                                ? `${review.text.slice(0, 150)}...`
                                : review.text}
                        </p>
                    </div>
                    <div className=" mb-2 mt-2 flex space-x-4">
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
                                {review._count.reviewComments}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="mx-auto mt-5 border-gray-200 dark:border-gray-700" />
        </>
    );
};

export default RecentReviewsCard;
