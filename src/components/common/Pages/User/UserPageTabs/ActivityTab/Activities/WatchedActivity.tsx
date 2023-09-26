import { fromNow } from "@/utils/general/dateFormat";
import Link from "next/link";

const WatchedActivity = ({
    small,
    movieTitle,
    createdAt,
    username,
    movieId,
}: {
    small: boolean;
    movieTitle: string;
    username: string;
    createdAt: Date;
    movieId: number;
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
                <Link
                    href={{
                        pathname: "/film/[id]",
                        query: {
                            id: movieId,
                        },
                    }}
                >
                    <span className="font-bold text-black hover:underline dark:text-white">
                        {movieTitle}
                    </span>
                </Link>
            </p>
        </div>
    );
};

export default WatchedActivity;
