import { api, type RouterOutputs } from "@/utils/api";
import clxsm from "@/utils/clsxm";
import { shortMonthDateFormat } from "@/utils/general/dateFormat";
import Image from "next/image";
import React from "react";
import { BsHeartFill } from "react-icons/bs";
import { Rating } from "react-simple-star-rating";
import ShowTags from "../../../Tags/ShowTags";
import Link from "next/link";
import { Container } from "@/components/common/Layout/Layout";

interface SingleReviewViewProps {
    review: RouterOutputs["review"]["review"];
}

const SingleReviewView = ({ review }: SingleReviewViewProps) => {
    const { review: reviewData } = review;
    const { user: author } = reviewData;

    const trpcUtils = api.useContext();
    const toggleLike = api.review.toggleReviewLike.useMutation({
        onSuccess: async () => {
            await trpcUtils.review.review.invalidate();
        },
    });

    const handleToggleLike = () => {
        toggleLike.mutate({ id: review.review.id });
    };
    return (
        <>
            <Container>
                <span className="mb-5 flex w-[100%] text-sm dark:text-slate-200">
                    Review by{" "}
                    <p className="ml-1 font-semibold dark:text-slate-300">
                        {" "}
                        {author.name}
                    </p>
                    {author.image && (
                        <Image
                            className="ml-1 rounded-full"
                            src={author.image}
                            alt={author.name!}
                            width={20}
                            height={20}
                        />
                    )}
                </span>
                <div className="flex">
                    <div className="w-[25%]">
                        {reviewData.moviePoster && (
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${reviewData.moviePoster}`}
                                alt={reviewData.movieTitle}
                                width={150}
                                height={150}
                                className="rounded-lg"
                            />
                        )}
                        <div className="mt-4 flex space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                            <BsHeartFill
                                onClick={handleToggleLike}
                                className={clxsm(
                                    reviewData.likedByMe
                                        ? "fill-crumble"
                                        : "fill-gray-600 dark:fill-gray-300",
                                    "mt-[5px] h-4 w-4 cursor-pointer hover:fill-crumble hover:dark:fill-crumble"
                                )}
                            />
                            <div className="mt-[3px] flex space-x-1">
                                <p>{reviewData.likeCount}</p>
                                <p>likes</p>
                            </div>
                        </div>
                        {reviewData.tags && <ShowTags tags={reviewData.tags} />}
                    </div>
                    <div className="ml-5 w-[80%]">
                        <div className="flex space-x-2">
                            <Link
                                href={{
                                    pathname: "/movie/[id]",
                                    query: {
                                        id: reviewData.movieId,
                                    },
                                }}
                            >
                                <h2>{reviewData.movieTitle}</h2>
                            </Link>
                            <p className="mt-[7px] text-lg text-slate-500 dark:text-slate-400">
                                {reviewData.movieReleaseYear.slice(0, 4)}
                            </p>
                            <Rating
                                className="mt-[10px]"
                                emptyStyle={{ display: "flex" }}
                                fillStyle={{
                                    display: "-webkit-inline-box",
                                }}
                                allowFraction={true}
                                initialValue={Number(reviewData.ratingGiven)}
                                size={20}
                                fillColor="#EF4444"
                            />
                        </div>
                        <p className="my-2 text-sm text-slate-500 dark:text-slate-400">
                            Watched on{" "}
                            {shortMonthDateFormat(reviewData.createdAt)}
                        </p>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
                            {reviewData.text}
                        </p>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default SingleReviewView;
