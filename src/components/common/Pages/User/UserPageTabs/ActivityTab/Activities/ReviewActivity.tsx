import { fromNow } from "@/utils/general/dateFormat";
import { Rating } from "react-simple-star-rating";

const ReviewActivity = ({
    small,
    movieTitle,
    createdAt,
    username,
    rating,
}: {
    small: boolean;
    movieTitle: string;
    rating: number;
    createdAt: Date;
    username: string;
}) => {
    return (
        <div>
            <div>
                <p className="text-xs font-normal text-crumble">
                    {fromNow(createdAt)}
                </p>
            </div>
            <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {username}{" "}
                </span>
                reviewed{" "}
                <span className="font-bold text-black dark:text-white">
                    {movieTitle}{" "}
                </span>
                and rated it
                <Rating
                    style={{ marginBottom: "2px", marginLeft: "5px" }}
                    emptyStyle={{ display: "flex" }}
                    fillStyle={{
                        display: "-webkit-inline-box",
                    }}
                    allowFraction={true}
                    initialValue={rating}
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
