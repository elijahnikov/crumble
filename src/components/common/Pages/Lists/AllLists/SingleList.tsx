import Link from "next/link";
import { type List } from "./InfiniteListSection";
import Image from "next/image";
import ListImageWide from "../ListsHomePage/ListImageWide";
import { BiSolidComment } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import clxsm from "@/utils/clsxm";

interface SingleListProps {
    list: List;
    toggleLike: (variables: { id: string }) => void;
}

const SingleList = ({ list, toggleLike }: SingleListProps) => {
    return (
        <div key={list.id} className="flex w-[95%]">
            <div className="relative m-1 mt-2 flex h-[150px] max-h-[150px] min-h-[150px] min-w-[300px] max-w-[300px] rounded-md border bg-brand-white p-2 dark:border-gray-800 dark:bg-brand">
                <ListImageWide
                    listId={list.id}
                    size={80}
                    posters={list.listEntries.map((list) => list.movie.poster)}
                />
            </div>
            <div className="w-full">
                <div>
                    <Link
                        href={{
                            pathname: "/list/[id]",
                            query: {
                                id: list.id,
                            },
                        }}
                    >
                        <h4 className="ml-3 mt-3 text-slate-700 dark:text-slate-200">
                            {list.title.length > 35
                                ? `${list.title.slice(0, 35)}...`
                                : list.title}
                        </h4>
                    </Link>
                </div>
                <div className="ml-3 mt-1 flex w-full flex-row">
                    <Link
                        className="flex"
                        href={{
                            pathname: "/[username]",
                            query: {
                                username: list.user.id,
                            },
                        }}
                    >
                        <div>
                            {list.user.image && (
                                <Image
                                    src={list.user.image}
                                    alt="profile picture"
                                    className="rounded-full"
                                    width={18}
                                    height={18}
                                />
                            )}
                        </div>
                        <p className="ml-2 mt-[2px] text-xs font-bold text-slate-700 hover:underline dark:text-slate-400">
                            {list.user.name}
                        </p>
                    </Link>
                </div>
                <p className="relative ml-3 mt-3  hidden w-[100%] text-sm text-slate-600 dark:text-slate-300 xl:block">
                    {list.description && list.description.length > 200 ? (
                        <span className="flex">
                            <span>
                                {list.description?.slice(0, 200)}
                                ...
                                <Link
                                    href={{
                                        pathname: "/lists/all/[sorting]",
                                        query: {
                                            sorting: "recent",
                                        },
                                    }}
                                >
                                    <span className="ml-1 text-xs text-crumble underline">
                                        See more
                                    </span>
                                </Link>
                            </span>
                        </span>
                    ) : (
                        list.description
                    )}
                </p>
                <div className="ml-2 mt-[10px]  flex space-x-2">
                    <div className="flex space-x-1">
                        <BsHeartFill
                            onClick={() => toggleLike({ id: list.id })}
                            className={clxsm(
                                list.likedByMe
                                    ? "fill-crumble "
                                    : "fill-slate-400 hover:fill-crumble dark:fill-slate-500",
                                "mt-[2px] h-4 w-4 cursor-pointer"
                            )}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            {list.likeCount}
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        <BiSolidComment className="mt-[2px] h-4 w-4 fill-slate-400 dark:fill-slate-500" />
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            {list.commentCount}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleList;
