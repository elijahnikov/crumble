import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { type RouterOutputs, api } from "@/utils/api";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";
import Link from "next/link";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import clxsm from "@/utils/clsxm";
import { BsHeartFill } from "react-icons/bs";

const TopReviews = () => {
    const { data, isLoading } = api.review.reviews.useQuery({
        limit: 6,
        dateSortBy: getDatesToSortBy("3 months"),
        orderBy: "reviewLikes",
    });
    return (
        <div>
            <div className="flex">
                <h4 className="text-sm text-slate-600 dark:text-slate-400">
                    Top Reviews this week
                </h4>
            </div>
            {isLoading && (
                <div className="mx-auto mt-5 flex w-full justify-center text-center">
                    <LoadingSpinner size={30} />
                </div>
            )}
            {!isLoading && data && data.reviews.length > 0 && (
                <div>
                    {data.reviews.map((review) => (
                        <ReviewRow review={review} key={review.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

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
                            <p className="ml-1 mt-[2px] text-[18px] font-semibold text-slate-500 dark:text-slate-500">
                                {review.movieReleaseYear.slice(0, 4)}
                            </p>
                        </div>
                        <div className="flex">
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
                                className="ml-2 mt-[15px]"
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
                        <div className="mt-3 text-[16px] font-semibold text-slate-700 dark:text-gray-400 dark:text-slate-300">
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

export default TopReviews;
