import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import ListImage from "../../../Lists/ListsHomePage/ListImage";
import Link from "next/link";
import { BsHeartFill } from "react-icons/bs";
import { BiSolidComment } from "react-icons/bi";

interface RecentActivityCardProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

const RecentListsCard = ({ user }: RecentActivityCardProps) => {
    const { data, isLoading } = api.list.lists.useQuery({
        username: user.name!,
        limit: 5,
    });

    return (
        <div>
            <div className="flex">
                <p className=" text-sm text-slate-600 dark:text-slate-300">
                    Recent lists
                </p>
                <Link href="/[username]/lists" as={`/@${user.name}/lists`}>
                    <p className="ml-4 mt-[2px] flex cursor-pointer text-xs font-normal text-crumble underline">
                        See more
                    </p>
                </Link>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />
            <div>
                <div className="mx-auto flex justify-center pt-2 text-center">
                    {isLoading && <LoadingSpinner size={30} />}
                </div>
                {data && (
                    <div>
                        {data.lists.length > 0 ? (
                            <div className="space-y-3">
                                {data.lists.map((list) => (
                                    <div
                                        className="rounded-md border bg-brand-white p-2 dark:border-gray-800 dark:bg-brand"
                                        key={list.id}
                                    >
                                        <div className="relative">
                                            <ListImage
                                                listId={list.id}
                                                size={50}
                                                posters={list.listEntries.map(
                                                    (list) => list.movie.poster
                                                )}
                                            />
                                            <hr className="my-2 dark:border-slate-800" />
                                            <Link
                                                href={{
                                                    pathname: "/list/[id]",
                                                    query: {
                                                        id: list.id,
                                                    },
                                                }}
                                            >
                                                <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                    {list.title.length > 35
                                                        ? `${list.title.slice(
                                                              0,
                                                              35
                                                          )}...`
                                                        : list.title}
                                                </p>
                                            </Link>
                                            <div className="flex w-full flex-row">
                                                <div className="mt-[1px]  flex space-x-2">
                                                    <div className="flex space-x-1">
                                                        <BsHeartFill className="mt-[2px] h-3 w-3 fill-slate-400 dark:fill-slate-500" />
                                                        <p className="text-xs text-slate-500 dark:text-slate-500">
                                                            {list.likeCount}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <BiSolidComment className="mt-[2px] h-3 w-3 fill-slate-400 dark:fill-slate-500" />
                                                        <p className="text-xs text-slate-500 dark:text-slate-500">
                                                            {list.commentCount}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No activity recorded.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentListsCard;
