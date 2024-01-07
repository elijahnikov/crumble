import clxsm from "@/utils/clsxm";
import { useCallback, useEffect, useState } from "react";
import { BsChevronDown, BsXCircleFill } from "react-icons/bs";
import Input from "@/components/ui/Input/Input";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { type ZodType } from "zod";
import { type ICastSearch, castSearchSchema } from "@/server/api/schemas/movie";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Image from "next/image";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Modal from "@/components/ui/Modal/Modal";

const CastSearch = ({
    chosenCast,
    setChosenCast,
    handleRemove,
    isMobile,
}: {
    isMobile: boolean;
    chosenCast: Array<ICastSearch>;
    setChosenCast: React.Dispatch<React.SetStateAction<Array<ICastSearch>>>;
    handleRemove: (castId: number) => void;
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [castSearchTerm, setCastSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [castData, setCastData] = useState<ICastSearch[]>([]);

    const fetchCastMembers = useCallback(async () => {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
            castSearchTerm
        )}&include_adult=false&language=en-US&page=1`;

        const data = (await fetchWithZod(
            url,
            castSearchSchema as ZodType
        )) as ICastSearch[];

        if (data) setCastData(data);

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    }, [castSearchTerm]);

    const handleChange = (cast: ICastSearch) => {
        const objectIndex = chosenCast.findIndex(
            (existingObject) => existingObject.id === cast.id
        );

        if (objectIndex !== -1) {
            const updatedArray = [...chosenCast];
            updatedArray.splice(objectIndex, 1);

            setChosenCast(updatedArray);
        } else {
            setChosenCast([...chosenCast, cast]);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (open && castSearchTerm !== "") void fetchCastMembers();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [castSearchTerm, fetchCastMembers, open]);

    return (
        <>
            <Modal open={open} onOpenChange={setOpen}>
                <Modal.Trigger styling={false}>
                    {!isMobile && (
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
                    )}
                    <div
                        className={clxsm(
                            "px-2 py-1.5",
                            "flex min-w-[150px] max-w-[200px] rounded-md border-[1px] border-slate-200 bg-brand-white text-left  text-sm dark:border-slate-700 dark:bg-brand"
                        )}
                    >
                        <p className={clxsm("w-[90%] text-xs font-normal")}>
                            Sort by cast
                        </p>
                        <BsChevronDown className="mt-1 fill-ink-light" />
                    </div>
                </Modal.Trigger>
                <Modal.Content title="Cast Search">
                    <div className="flex w-full columns-4 flex-wrap gap-1">
                        {chosenCast.map((cast) => (
                            <ChosenCastPill
                                key={cast.id}
                                cast={cast}
                                handleRemove={handleRemove}
                            />
                        ))}
                    </div>
                    <Input
                        clearable={true}
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
                    {!loading &&
                        castData.length === 0 &&
                        castSearchTerm.length > 0 && (
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
                                (k) => typeof k.originalTitle !== "undefined"
                            )?.originalTitle;
                            return (
                                <div
                                    key={cast.id}
                                    className="my-2 mb-2 flex rounded-md border p-1 dark:border-slate-800"
                                >
                                    <Checkbox
                                        checked={
                                            chosenCast.findIndex(
                                                (existingObject) =>
                                                    existingObject.id ===
                                                    cast.id
                                            ) !== -1
                                        }
                                        onChange={() => handleChange(cast)}
                                        className="ml-1 mr-3 mt-[6px]"
                                    />
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
                                            <p className="ml-2 text-xs text-slate-500 dark:text-slate-400">
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
                </Modal.Content>
            </Modal>
        </>
    );
};

export const ChosenCastPill = ({
    cast,
    handleRemove,
}: {
    cast: ICastSearch;
    handleRemove: (castId: number) => void;
}) => {
    return (
        <div className="mb-2 mr-2 flex">
            <div className="flex rounded-l-md bg-gray-200 p-1 dark:bg-slate-800">
                <div className="relative h-5 w-5 overflow-hidden rounded-full">
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${cast.profilePath}`}
                        alt={cast.originalName}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                    />
                </div>
                <p className="ml-1 mt-[2px] text-xs">{cast.originalName}</p>
            </div>
            <div
                onClick={() => handleRemove(cast.id)}
                className="cursor-pointer rounded-r-md bg-brand-white px-2 dark:bg-slate-700"
            >
                <BsXCircleFill className="mt-2 h-3 w-3 fill-crumble" />
            </div>
        </div>
    );
};

export default CastSearch;
