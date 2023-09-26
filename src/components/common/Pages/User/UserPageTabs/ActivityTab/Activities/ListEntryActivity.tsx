import { fromNow } from "@/utils/general/dateFormat";
import Link from "next/link";

const ListEntryActivity = ({
    small,
    movieTitle,
    movieId,
    listTitle,
    createdAt,
    username,
    listId,
}: {
    small: boolean;
    movieTitle: string;
    listTitle: string;
    createdAt: Date;
    username: string;
    movieId: number;
    listId: string;
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
                to their list{" "}
                <Link
                    href={{
                        pathname: "/list/[id]",
                        query: {
                            id: listId,
                        },
                    }}
                >
                    <span className="font-bold text-black hover:underline dark:text-white">
                        {listTitle}
                    </span>
                </Link>
            </p>
        </div>
    );
};

export default ListEntryActivity;
