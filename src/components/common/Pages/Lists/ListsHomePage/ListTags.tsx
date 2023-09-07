import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { api } from "@/utils/api";
import Link from "next/link";

const ListTags = () => {
    const { data, isLoading } = api.list.tags.useQuery();

    return (
        <div className="mt-5 w-full">
            <div className="ml-3 flex">
                <p className="font-semibold dark:text-slate-200">
                    Popular Tags
                </p>
                <Link
                    href={{
                        pathname: "/tags/lists/[sorting]",
                        query: {
                            sorting: "popular",
                        },
                    }}
                >
                    <p className="ml-2 mt-[5px] text-xs text-crumble">
                        See more
                    </p>
                </Link>
            </div>
            <div className="mt-4">
                {isLoading ? (
                    <div className="items-center justify-center text-center align-middle">
                        <div className="mx-auto mt-5 w-max">
                            <LoadingSpinner size={30} />
                        </div>
                    </div>
                ) : data && data.length > 0 ? (
                    data.map((tag) => (
                        <Link
                            key={tag.id}
                            href={{
                                pathname: "/tags/lists/all/[tag]",
                                query: {
                                    tag: tag.text,
                                },
                            }}
                        >
                            <span
                                className="mb-2 ml-2 inline-block cursor-pointer rounded-[5px] border-t-[1px] bg-brand-white p-[5px] 
                                text-xs hover:bg-gray-300 dark:border-gray-800 dark:bg-brand dark:hover:bg-gray-800"
                            >
                                {tag.text}
                            </span>
                        </Link>
                    ))
                ) : (
                    <p>No tags found</p>
                )}
            </div>
        </div>
    );
};

export default ListTags;
