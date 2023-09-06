import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import ListImage from "./ListImage";
import Image from "next/image";
import { BsHeartFill } from "react-icons/bs";
import { BiSolidComment } from "react-icons/bi";

const PopularLists = () => {
    const { data, isLoading, isError } = api.list.lists.useQuery({
        limit: 4,
    });

    return (
        <div className="mt-5 w-full">
            <p className="font-semibold dark:text-slate-200">
                Popular this week
            </p>
            <div className="flex">
                {isLoading ? (
                    <div className="items-center justify-center text-center align-middle">
                        <div className="mx-auto w-max">
                            <LoadingSpinner size={30} />
                        </div>
                    </div>
                ) : data && data?.lists.length > 0 ? (
                    data?.lists.map((list) => (
                        <div
                            className="m-1 mt-2 w-[33%] rounded-md border bg-brand-white p-2 dark:border-gray-800 dark:bg-brand"
                            key={list.id}
                        >
                            <div>
                                <ListImage
                                    size={119}
                                    posters={list.listEntries.map(
                                        (list) => list.movie.poster
                                    )}
                                />
                                <hr className="my-2 dark:border-slate-800" />
                                <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    {list.title.length > 35
                                        ? `${list.title.slice(0, 35)}...`
                                        : list.title}
                                </p>
                                <div className="mt-1 flex w-full flex-row">
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
                                    <p className="ml-2 mt-[2px] text-xs font-bold text-slate-700 dark:text-slate-400">
                                        {list.user.name}
                                    </p>
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
                    <p>No lists found</p>
                )}
            </div>
        </div>
    );
};

export default PopularLists;
