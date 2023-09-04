import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import ListImage from "./ListImage";

const PopularLists = () => {
    const { data, isLoading, isError } = api.list.lists.useQuery({
        limit: 4,
    });

    return (
        <div>
            <p className="font-semibold dark:text-slate-200">
                Popular this week
            </p>
            {isLoading ? (
                <div className="items-center justify-center text-center align-middle">
                    <div className="mx-auto w-max">
                        <LoadingSpinner size={30} />
                    </div>
                </div>
            ) : data && data?.lists.length > 0 ? (
                data?.lists.map((list) => (
                    <div className="w-max" key={list.id}>
                        <>
                            <p>{list.title}</p>
                            <ListImage
                                size={90}
                                posters={list.listEntries.map(
                                    (list) => list.movie.poster
                                )}
                            />
                        </>
                    </div>
                ))
            ) : (
                <p>No lists found</p>
            )}
        </div>
    );
};

export default PopularLists;
