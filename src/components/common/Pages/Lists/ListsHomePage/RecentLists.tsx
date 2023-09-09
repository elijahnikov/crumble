import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import Link from "next/link";
import { BiSolidComment } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import Image from "next/image";
import ListImageWide from "./ListImageWide";

const RecentLists = () => {
    const { data, isLoading } = api.list.lists.useQuery({
        limit: 10,
    });
    return (
        <div className="mt-5">
            <div className="ml-2 flex">
                <p className="font-semibold dark:text-slate-200">
                    Recent reviews
                </p>
                <Link
                    href={{
                        pathname: "/lists/all/[sorting]",
                        query: {
                            sorting: "recent",
                        },
                    }}
                >
                    <p className="ml-2 mt-[5px] text-xs text-crumble">
                        See more
                    </p>
                </Link>
            </div>
            <div className="mt-2">
                {isLoading ? (
                    <div className="items-center justify-center text-center align-middle">
                        <div className="mx-auto w-max">
                            <LoadingSpinner size={30} />
                        </div>
                    </div>
                ) : data && data?.lists.length > 0 ? (
                    data?.lists.map((list) => (
                        <div key={list.id} className="flex">
                            <div className="relative m-1 mt-2 flex h-[150px] max-h-[150px] min-h-[150px] min-w-[300px] max-w-[300px] rounded-md border bg-brand-white p-2 dark:border-gray-800 dark:bg-brand">
                                <ListImageWide
                                    listId={list.id}
                                    size={80}
                                    posters={list.listEntries.map(
                                        (list) => list.movie.poster
                                    )}
                                />
                            </div>
                            <div>
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
                                                ? `${list.title.slice(
                                                      0,
                                                      35
                                                  )}...`
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
                                    <div className="ml-2 mt-[1px]  flex space-x-2">
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
                                <p className="relative ml-3 mt-3 hidden max-w-[500px] text-sm text-slate-600 dark:text-slate-300 xl:block">
                                    {list.description &&
                                    list.description.length > 100 ? (
                                        <span className="flex">
                                            <span>
                                                {list.description?.slice(
                                                    0,
                                                    100
                                                )}
                                                ...
                                                <Link
                                                    href={{
                                                        pathname:
                                                            "/lists/all/[sorting]",
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
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="my-auto flex h-[100px] w-[90%] justify-center rounded-md border bg-brand-white text-center dark:border-slate-700  dark:bg-brand">
                        <p className="mt-[35px] text-slate-600 dark:text-slate-400">
                            No lists found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentLists;
