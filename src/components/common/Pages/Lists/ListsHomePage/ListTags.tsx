import { api } from "@/utils/api";
import Link from "next/link";

const ListTags = () => {
    const { data, isLoading } = api.list.tags.useQuery();

    return (
        <div className="mt-5 w-full">
            <div className="ml-2 flex">
                <p className="font-semibold dark:text-slate-200">
                    Popular Tags
                </p>
                <Link
                    href={{
                        pathname: "/lists/all/[sorting]",
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
        </div>
    );
};

export default ListTags;
