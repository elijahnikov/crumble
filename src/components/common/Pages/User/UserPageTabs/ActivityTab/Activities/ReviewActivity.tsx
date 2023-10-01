import { type RouterOutputs } from "@/utils/api";
import { fromNow } from "@/utils/general/dateFormat";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";

const ReviewActivity = ({
    small,
    activity,
}: {
    small: boolean;
    activity: RouterOutputs["activity"]["getActivityForUser"]["activities"][number];
}) => {
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
