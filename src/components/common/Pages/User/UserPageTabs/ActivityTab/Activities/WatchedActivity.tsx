import { fromNow } from "@/utils/general/dateFormat";

const WatchedActivity = ({
    small,
    movieTitle,
    createdAt,
    username,
}: {
    small: boolean;
    movieTitle: string;
    username: string;
    createdAt: Date;
}) => {
    return (
        <div>
            <div>
                <p className="text-xs font-normal text-crumble">
                    {fromNow(createdAt)}
                </p>
            </div>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {username}{" "}
                </span>
                watched{" "}
                <span className="font-bold text-black dark:text-white">
                    {movieTitle}
                </span>
            </p>
        </div>
    );
};

export default WatchedActivity;
