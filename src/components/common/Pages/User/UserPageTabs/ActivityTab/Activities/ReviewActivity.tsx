import { type RouterOutputs } from "@/utils/api";
import { fromNow } from "@/utils/general/dateFormat";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";

const ReviewActivity = ({
    card = true,
    activity,
}: {
    card?: boolean;
    activity: RouterOutputs["activity"]["getActivityForUser"]["activities"][number];
}) => {
    if (!card) {
        return (
            <div className="flex">
                <div className="py-3 pl-2">
                    {activity.review?.moviePoster && (
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${activity.review.moviePoster}`}
                            alt="movie poster"
                            width={70}
                            height={70}
                            className="rounded-md"
                        />
                    )}
                </div>
                <div className="ml-5 py-3">
                    <p className="mb-2 text-xs font-normal text-crumble">
                        {fromNow(activity.createdAt)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">
                            {activity.user.name}
                        </span>{" "}
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            watched and reviewed
                        </span>
                    </p>
                    <div className="mt-1 flex">
                        <p className="flex text-xl">
                            {activity.review?.movieTitle}
                            <p className="relative top-[3px] ml-2 text-[12px] font-normal text-crumble">
                                {activity.review?.movieReleaseYear.slice(0, 4)}
                            </p>
                        </p>
                    </div>
                    <p className="mt-2 text-[16px] font-normal text-slate-700 dark:text-slate-200">
                        {activity.review?.text}
                    </p>
                    <Rating
                        style={{ marginTop: "-10px", marginBottom: "-10px" }}
                        emptyStyle={{ display: "flex" }}
                        fillStyle={{
                            display: "-webkit-inline-box",
                        }}
                        allowFraction={true}
                        initialValue={activity.review?.ratingGiven}
                        size={16}
                        readonly
                        emptyColor="#404446"
                        fillColor="#EF4444"
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <p className="text-xs font-normal text-crumble">
                    {fromNow(activity.createdAt)}
                </p>
            </div>
            <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {activity.user.name}{" "}
                </span>
                reviewed{" "}
                <Link
                    href={{
                        pathname: "/movie/[id]",
                        query: {
                            id: activity.review?.movieId,
                        },
                    }}
                >
                    <span className="font-bold text-black hover:underline dark:text-white">
                        {activity.review?.movieTitle}
                    </span>
                </Link>{" "}
                and rated it{" "}
                <Rating
                    style={{ marginBottom: "2px" }}
                    emptyStyle={{ display: "flex" }}
                    fillStyle={{
                        display: "-webkit-inline-box",
                    }}
                    allowFraction={true}
                    initialValue={activity.review?.ratingGiven}
                    size={14}
                    readonly
                    emptyColor="#404446"
                    fillColor="#EF4444"
                />
            </div>
        </div>
    );
};

export default ReviewActivity;
