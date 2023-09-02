import { Container } from "@/components/common/Layout/Layout";
import { LoadingPage } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { type RouterOutputs, api } from "@/utils/api";
import clxsm from "@/utils/clsxm";
import Image from "next/image";
import React from "react";
import { BiSolidComment } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import { Rating } from "react-simple-star-rating";

interface ReviewSectionProps {
    movieId: number;
    orderBy?: string;
}

const ReviewSection = ({ movieId, orderBy }: ReviewSectionProps) => {
    const { data, isLoading } = api.review.reviews.useQuery(
        orderBy
            ? {
                  limit: 2,
                  movieId,
                  orderBy,
              }
            : { limit: 2, movieId }
    );

    if (isLoading) {
        return (
            <Container>
                <div className="mt-5">
                    <LoadingPage />
                </div>
            </Container>
        );
    }

    if (data && data.reviews.length === 0) {
        return (
            <Container>
                <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        {orderBy ? `TOP REVIEWS` : `LATEST REVIEWS`}
                    </p>
                    <div className="mt-4 text-center">
                        <h3 className="text-slate-700 dark:text-slate-200">
                            No reviews yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Let others know what you think!
                        </p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    {orderBy ? `TOP REVIEWS` : `LATEST REVIEWS`}
                </p>
                <div className="mt-4">
                    {data
                        ? data.reviews.map((review) => (
                              <ReviewRow review={review} key={review.id} />
                          ))
                        : null}
                </div>
                <div className="mb-[-15px] mt-4 text-center">
                    <p className="text-sm font-semibold">See more...</p>
                </div>
            </div>
        </Container>
    );
};

export default ReviewSection;

interface ReviewRow {
    review: RouterOutputs["review"]["reviews"]["reviews"][0];
}

const ReviewRow = ({ review }: ReviewRow) => {
    return (
        <div className="mt-5 px-5">
            <div className="flex">
                {review.user.image && (
                    <Image
                        alt={review.user.name!}
                        src={review.user.image}
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                )}
                <p className="ml-2 mt-1 text-sm font-semibold">
                    {review.user.name}
                </p>
                <Rating
                    className="ml-3"
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
            <div className="mt-2 text-sm dark:text-slate-200">
                {review.text}
            </div>
            <div className=" mb-2 mt-2 flex space-x-4">
                <div className=" flex space-x-1 text-xs">
                    <p className="text-slate-700 dark:text-slate-400">
                        {review.likeCount}
                    </p>
                    <BiSolidComment className="dark-fill-slate-400 mt-1 fill-slate-600" />
                </div>
                <div className="flex space-x-1 text-xs">
                    <p className="dark:text-slate-400">
                        {review._count.reviewComments}
                    </p>
                    <BsHeartFill
                        className={clxsm(
                            "mt-1",
                            review.likedByMe
                                ? "fill-crumble"
                                : "dark-fill-slate-400 fill-slate-600"
                        )}
                    />
                </div>
            </div>
            <hr className="mt-5 border-gray-200 dark:border-gray-700" />
        </div>
    );
};
