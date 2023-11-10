import clxsm from "@/utils/clsxm";
import { useCallback, useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import Input from "@/components/ui/Input/Input";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { type ZodType } from "zod";
import { type ICastSearch, castSearchSchema } from "@/server/api/schemas/movie";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Image from "next/image";
import Checkbox from "@/components/ui/Checkbox/Checkbox";

const CastSearch = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [castSearchTerm, setCastSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [castData, setCastData] = useState<ICastSearch[]>([]);

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

        if (data) setCastData(data);
        console.log(data);

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
                            onChange={(e) => {
                                if (e.target.value === "") setCastData([]);
                                setCastSearchTerm(e.target.value);
                            }}
                            placeholder="Search cast members"
                        />
                        {loading && (
                            <div className="mx-auto flex w-full justify-center py-4">
                                <LoadingSpinner size={20} />
                            </div>
                        )}
                        {!loading && castData.length === 0 && (
                            <div className="mx-auto flex w-full justify-center py-4 text-center">
                                <p className="text-xs">
                                    No cast member found with that search query.
                                </p>
                            </div>
                        )}
                        {!loading &&
                            castData.length > 0 &&
                            castData.slice(0, 5).map((cast) => {
                                const knownForTitle = cast.knownFor.find(
                                    (k) =>
                                        typeof k.originalTitle !== "undefined"
                                )?.originalTitle;
                                return (
                                    <div
                                        key={cast.id}
                                        className="flex w-full rounded-md border p-1 dark:border-slate-800"
                                    >
                                        <Checkbox className="ml-1 mr-3 mt-[6px]" />
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w500${cast.profilePath}`}
                                                alt={cast.originalName}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="ml-2 mt-[3px] text-xs">
                                                {cast.originalName}
                                            </p>
                                            {cast.knownFor.length > 0 && (
                                                <p className="ml-2 text-xs dark:text-slate-400">
                                                    {knownForTitle &&
                                                    knownForTitle.length > 30
                                                        ? `${knownForTitle.slice(
                                                              0,
                                                              30
                                                          )}...`
                                                        : knownForTitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
        </>
    );
};

export default CastSearch;
