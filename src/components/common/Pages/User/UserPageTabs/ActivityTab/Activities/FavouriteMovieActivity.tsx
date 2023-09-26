import { fromNow } from "@/utils/general/dateFormat";

const FavouriteMovieActivity = ({
    small,
    movieTitle,
    createdAt,
    username,
}: {
    small: boolean;
    movieTitle: string;
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
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {username}{" "}
                </span>
                added{" "}
                <span className="font-bold text-black dark:text-white">
                    {movieTitle}{" "}
                </span>
                to their favourite movie list.
            </p>
        </div>
    );
};

export default FavouriteMovieActivity;
