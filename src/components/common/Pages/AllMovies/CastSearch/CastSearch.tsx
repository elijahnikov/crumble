import clxsm from "@/utils/clsxm";
import { useCallback, useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import Input from "@/components/ui/Input/Input";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { type ZodType } from "zod";
import { type ICastSearch, castSearchSchema } from "@/server/api/schemas/movie";

const CastSearch = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [castSearchTerm, setCastSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCastMembers = useCallback(async () => {
        setLoading(true);
        const url2 = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
            castSearchTerm
        )}&include_adult=false&language=en-US&page=1`;
        const url =
            "https://api.themoviedb.org/3/search/person?query=Robert%20Downey&include_adult=false&language=en-US&page=1";

        const data = (await fetchWithZod(
            url2,
            castSearchSchema as ZodType
        )) as ICastSearch[];
        console.log({ url, data, url2 });

        // const data = (await fetchWithZod(
        //     url,
        //     allMovieDetailsFetchSchema as ZodType
        // )) as IAllMovieDetailsFetch[];
        // const data2 = (await fetchWithZod(
        //     url.replace(`page=${page}`, `page=${page2}`),
        //     allMovieDetailsFetchSchema as ZodType
        // )) as IAllMovieDetailsFetch[];

        // if (data && data2) setMovieData(data.concat(data2));

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    }, [castSearchTerm]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (open && castSearchTerm !== "") void fetchCastMembers();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [castSearchTerm, fetchCastMembers, open]);

    return (
        <>
            <PopoverPrimitive.Root
                open={open}
                onOpenChange={() => setOpen(!open)}
            >
                <PopoverPrimitive.Trigger>
                    <div className="relative top-[-3px] ml-[2px] text-left">
                        <p
                            className={clxsm(
                                "text-black dark:text-white",
                                "text-xs"
                            )}
                        >
                            Cast
                        </p>
                    </div>
                    <div
                        className={clxsm(
                            "px-2 py-1.5",
                            "flex min-w-[150px] max-w-[200px] rounded-md border-[1px] border-slate-200 bg-brand-white text-left  text-sm dark:border-slate-700 dark:bg-brand"
                        )}
                    >
                        <p className={clxsm("w-[90%] text-xs font-normal")}>
                            Sort by cast...
                        </p>
                        <BsChevronDown className="mt-1 fill-ink-light" />
                    </div>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        className={clxsm(
                            "max-h-[400px] w-[300px] space-y-1 p-[3px]",
                            "mt-2  overflow-y-auto rounded-lg border-[1px] border-slate-200 bg-white  dark:border-gray-700 dark:bg-black"
                        )}
                    >
                        <Input
                            size={"sm"}
                            fullWidth
                            value={castSearchTerm}
                            onChange={(e) => setCastSearchTerm(e.target.value)}
                            placeholder="Search cast members"
                        />
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
        </>
    );
};

export default CastSearch;
