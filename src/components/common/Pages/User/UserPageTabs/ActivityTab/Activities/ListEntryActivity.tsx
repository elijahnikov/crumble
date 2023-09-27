import { type RouterOutputs } from "@/utils/api";
import { fromNow } from "@/utils/general/dateFormat";
import Link from "next/link";

const ListEntryActivity = ({
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
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {activity.user.name}{" "}
                </span>
                added{" "}
                <Link
                    href={{
                        pathname: "/movie/[id]",
                        query: {
                            id: activity.listEntry?.movie.movieId,
                        },
                    }}
                >
                    <span className="font-bold text-black hover:underline dark:text-white">
                        {activity.listEntry?.movie.title}
                    </span>
                </Link>{" "}
                to their list{" "}
                <Link
                    href={{
                        pathname: "/list/[id]",
                        query: {
                            id: activity.list?.id,
                        },
                    }}
                >
                    <span className="font-bold text-black hover:underline dark:text-white">
                        {activity.listEntry?.list.title}
                    </span>
                </Link>
            </p>
        </div>
    );
};

export default ListEntryActivity;
