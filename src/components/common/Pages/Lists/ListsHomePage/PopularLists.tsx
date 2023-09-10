import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import ListImage from "./ListImage";
import Image from "next/image";
import { BsHeartFill } from "react-icons/bs";
import { BiSolidComment } from "react-icons/bi";
import Link from "next/link";

const PopularLists = () => {
    const { data, isLoading } = api.list.lists.useQuery({
        limit: 3,
        orderBy: "listLikes",
    });

    return (
        <div className="mt-5 w-full">
            <div className="ml-2 flex">
                <p className="font-semibold dark:text-slate-200">
                    Popular this week
                </p>
                <Link
                    href={{
                        pathname: "/lists/all/[sorting]",
                        query: {
                            sorting: "top",
                        },
                    }}
                >
                    <p className="ml-2 mt-[5px] text-xs text-crumble">
                        See more
                    </p>
                </Link>
            </div>
            <div className="mt-2 flex">
                {isLoading ? (
                    <div className="items-center justify-center text-center align-middle">
                        <div className="mx-auto w-max">
                            <LoadingSpinner size={30} />
                        </div>
                    </div>
                ) : data && data?.lists.length > 0 ? (
                    data?.lists.map((list) => (
                        <div
                            className="mx-2 w-[33%] rounded-md border  bg-brand-white p-2 dark:border-gray-800 dark:bg-brand"
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
                                            ? `${list.title.slice(0, 35)}...`
                                            : list.title}
                                    </p>
                                </Link>
                                <div className="my-1 flex w-full flex-row">
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
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="my-auto flex h-[100px] w-full justify-center rounded-md border bg-brand-white text-center dark:border-slate-700  dark:bg-brand">
                        <p className="mt-[35px] text-slate-600 dark:text-slate-400">
                            No lists found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopularLists;
