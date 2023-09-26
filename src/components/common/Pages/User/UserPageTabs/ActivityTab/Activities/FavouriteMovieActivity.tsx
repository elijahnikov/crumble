import { fromNow } from "@/utils/general/dateFormat";
import Link from "next/link";

const FavouriteMovieActivity = ({
    small,
    movieTitle,
    movieId,
    createdAt,
    username,
}: {
    small: boolean;
    createdAt: Date;
    movieTitle: string;
    movieId: number;
    username: string;
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
                added{" "}
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
                </Link>{" "}
                to their favourite movie list.
            </p>
        </div>
    );
};

export default FavouriteMovieActivity;
