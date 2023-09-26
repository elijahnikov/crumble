import { fromNow } from "@/utils/general/dateFormat";

const ListEntryActivity = ({
    small,
    movieTitle,
    listTitle,
    createdAt,
    username,
}: {
    small: boolean;
    movieTitle: string;
    listTitle: string;
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
                to their list{" "}
                <span className="font-bold text-black dark:text-white">
                    {listTitle}
                </span>
            </p>
        </div>
    );
};

export default ListEntryActivity;
