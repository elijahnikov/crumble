import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import ListImage from "./ListImage";

const PopularLists = () => {
    const { data, isLoading, isError } = api.list.lists.useQuery({
        limit: 4,
    });

    return (
        <div className="w-full">
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
                        <div className="m-1 mt-2 w-[33%]" key={list.id}>
                            <div>
                                <ListImage
                                    size={103}
                                    posters={list.listEntries.map(
                                        (list) => list.movie.poster
                                    )}
                                />
                                <p className="p-2 text-xs">
                                    {list.title.length > 28
                                        ? `${list.title.slice(0, 28)}...`
                                        : list.title}
                                </p>
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
