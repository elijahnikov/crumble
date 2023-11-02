import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api, type RouterOutputs } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { useEffect, useState } from "react";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";
import { Select } from "@/components/ui/Select/Select";
import { Rating } from "react-simple-star-rating";
import { BsHeartFill } from "react-icons/bs";
import clxsm from "@/utils/clsxm";
import { BiSolidComment } from "react-icons/bi";
import ListImageWide from "../../../Lists/ListsHomePage/ListImageWide";

const sortToKeyMap: Record<
    string,
    { key: string; direction: "desc" | "asc" | undefined }
> = {
    Top: { key: "reviewLikes", direction: "desc" },
    Newest: { key: "createdAt", direction: "desc" },
    Controversial: { key: "reviewLikes", direction: "asc" },
};

const filterMap = {
    duration: ["1 day", "1 week", "30 days", "6 months", "1 year", "All time"],
    sortBy: ["Newest", "Top", "Controversial"],
};

const ListsTab = ({
    user,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}) => {
    const [selectedDurationSort, setSelectedDurationSort] =
        useState<string>("30 days");
    const [sortBySelection, setSortBySelection] = useState<string>("Newest");

    const {
        data: listsData,
        isInitialLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = api.list.lists.useInfiniteQuery(
        {
            username: user.name!,
            limit: 10,
            orderBy: sortToKeyMap[sortBySelection]?.key,
            dateSortBy: getDatesToSortBy(selectedDurationSort),
            orderDirection: sortToKeyMap[sortBySelection]?.direction,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    useEffect(() => {
        getDatesToSortBy(selectedDurationSort);
    }, [selectedDurationSort]);

    if (isError) {
        return <div>Error...</div>;
    }

    if (isInitialLoading) {
        return (
            <div className="mx-auto mt-10 flex w-full justify-center">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    const lists = listsData?.pages.flatMap((page) => page.lists);

    if (!lists || lists.length === 0) {
        return (
            <div>
                <div className="mb-2 mt-2 flex space-x-2">
                    <div className="w-full" />
                    {(sortBySelection === "Top" ||
                        sortBySelection === "Controversial") && (
                        <Select
                            size="sm"
                            value={selectedDurationSort}
                            setValue={setSelectedDurationSort}
                        >
                            {filterMap.duration.map((filter, index) => (
                                <Select.Item
                                    size="sm"
                                    key={index}
                                    value={filter}
                                >
                                    {filter}
                                </Select.Item>
                            ))}
                        </Select>
                    )}
                    <Select
                        value={sortBySelection}
                        setValue={setSortBySelection}
                        size="sm"
                    >
                        {filterMap.sortBy.map((filter, index) => (
                            <Select.Item key={index} size="sm" value={filter}>
                                {filter}
                            </Select.Item>
                        ))}
                    </Select>
                </div>
                <div className="w-full text-center">
                    <p className="mt-5 text-sm font-normal text-slate-600 dark:text-slate-400">
                        No lists found for {user.name}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-2 mt-2 flex space-x-2">
                <div className="w-full" />
                {(sortBySelection === "Top" ||
                    sortBySelection === "Controversial") && (
                    <Select
                        size="sm"
                        value={selectedDurationSort}
                        setValue={setSelectedDurationSort}
                    >
                        {filterMap.duration.map((filter, index) => (
                            <Select.Item size="sm" key={index} value={filter}>
                                {filter}
                            </Select.Item>
                        ))}
                    </Select>
                )}
                <Select
                    value={sortBySelection}
                    setValue={setSortBySelection}
                    size="sm"
                >
                    {filterMap.sortBy.map((filter, index) => (
                        <Select.Item key={index} size="sm" value={filter}>
                            {filter}
                        </Select.Item>
                    ))}
                </Select>
            </div>
            <div className="mt-2 w-full gap-3 border-t-[1px] py-2 dark:border-slate-700">
                {lists.map((list) => (
                    <ListRow key={list.id} list={list} />
                ))}
            </div>
            {hasNextPage && (
                <div className="mx-auto mt-5 flex w-full justify-center">
                    <Button
                        onClick={() => void fetchNextPage()}
                        loading={isFetchingNextPage}
                        size={"sm"}
                    >
                        More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ListsTab;

interface ListRow {
    list: RouterOutputs["list"]["lists"]["lists"][0];
}

const ListRow = ({ list }: ListRow) => {
    return (
        <div className=" flex" key={list.id}>
            <div className="m-1 mt-2 flex h-[150px] max-h-[150px] min-h-[150px] min-w-[300px] max-w-[300px] rounded-md border bg-brand-white p-2 dark:border-gray-800 dark:bg-brand">
                <ListImageWide
                    listId={list.id}
                    size={50}
                    posters={list.listEntries.map((list) => list.movie.poster)}
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
                                ? `${list.title.slice(0, 35)}...`
                                : list.title}
                        </h4>
                    </Link>
                </div>
                <div className="ml-3 mt-1 flex w-full flex-row">
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
                <p className="relative ml-3 mt-3 hidden max-w-[500px] text-sm text-slate-600 dark:text-slate-300 xl:block">
                    {list.description && list.description.length > 100 ? (
                        <span className="flex">
                            <span>
                                {list.description?.slice(0, 100)}
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
            </div>
        </div>
    );
};
