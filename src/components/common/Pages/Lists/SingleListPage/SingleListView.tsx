import { Container } from "@/components/common/Layout/Layout";
import ShowTags from "@/components/common/Tags/ShowTags";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { type RouterOutputs, api } from "@/utils/api";
import clxsm from "@/utils/clsxm";
import { fromNow } from "@/utils/general/dateFormat";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { BsHeartFill, BsX } from "react-icons/bs";
import AddMovieToList from "./AddMovieToList";
import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";

interface SingleListViewProps {
    list: RouterOutputs["list"]["list"];
}

const SingleListView = ({ list }: SingleListViewProps) => {
    const [editingMode, setEditingMode] = useState<boolean>(false);
    const [idsToRemove, setIdsToRemove] = useState<Array<string>>([]);

    const { list: listData } = list;
    const { user: author } = listData;

    const { data: session } = useSession();
    const authenticated = !!session;

    const trpcUtils = api.useContext();

    const [title, setTitle] = useState<string>(listData.title);
    const [description, setDescription] = useState<string | undefined>(
        listData.description ? listData.description : ""
    );

    const toggleLike = api.list.toggleListLike.useMutation({
        onSuccess: async () => {
            await trpcUtils.list.list.invalidate();
        },
    });

    const { mutate: removeEntryMutate } =
        api.list.removeEntryFromList.useMutation({
            onSuccess: () => {
                toast.success("Successfully removed from your list", {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
            },
        });

    const { mutate: editListMutate } = api.list.updateList.useMutation({
        onSuccess: async () => {
            toast.success("Successfully updated your list!", {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
            await trpcUtils.list.list.invalidate();
        },
    });

    const handleToggleLike = () => {
        if (authenticated) toggleLike.mutate({ id: list.list.id });
        else {
            toast.error(`Please sign in to perform that action`, {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
        }
    };

    const handleSaveEditing = async (listId: string) => {
        removeEntryMutate({ listId, entryIds: idsToRemove });
        editListMutate({ id: listData.id, title, description });
        setEditingMode(false);
        await trpcUtils.list.invalidate();
    };

    const handleCancelEditing = () => {
        setIdsToRemove([]);
        setEditingMode(false);
    };

    return (
        <>
            <Container>
                <div>
                    <div className="flex">
                        {author.image ? (
                            <Image
                                className="rounded-full"
                                alt={author.name!}
                                src={author.image}
                                width={30}
                                height={30}
                            />
                        ) : null}
                        <span className="text-md ml-2 mt-1 font-semibold text-slate-700 dark:text-slate-200">
                            {author.name}
                        </span>
                        <div className="ml-4 mt-[9px] text-xs uppercase dark:text-slate-400">
                            Created {fromNow(listData.createdAt)}
                        </div>
                    </div>
                    <div>
                        <div className="flex">
                            {!editingMode ? (
                                <h3 className="mt-4">{listData.title}</h3>
                            ) : (
                                <Input
                                    value={title}
                                    change={setTitle}
                                    className="mt-3 w-max"
                                />
                            )}
                            <div className="ml-5 mt-[20px]">
                                {!editingMode ? (
                                    <div>
                                        <Button
                                            onClick={() => setEditingMode(true)}
                                            size="sm"
                                            intent={"secondary"}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() =>
                                                void handleSaveEditing(
                                                    listData.id
                                                )
                                            }
                                            intent={"primary"}
                                            size="sm"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleCancelEditing()
                                            }
                                            intent={"secondary"}
                                            size="sm"
                                        >
                                            Discard
                                        </Button>
                                        {idsToRemove.length > 0 ? (
                                            <p className="ml-2 mt-[5px] text-xs text-crumble">
                                                {`Removing ${idsToRemove.length} films`}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                        {!editingMode ? (
                            <p className="mb-2 mt-1 text-slate-600 dark:text-slate-300">
                                {listData.description}
                            </p>
                        ) : (
                            <InputArea
                                value={description ? description : ""}
                                change={setDescription}
                                className="mt-2 w-full"
                            />
                        )}
                        {listData.tags ? (
                            <ShowTags tags={listData.tags} />
                        ) : null}
                    </div>
                    <div className="mt-5 grid w-full grid-cols-5 gap-2">
                        {listData.listEntries
                            .filter((entry) => !idsToRemove.includes(entry.id))
                            .map(({ movie, id }) => (
                                <div
                                    className=" break-inside-avoid-column"
                                    key={movie.movieId}
                                >
                                    <div
                                        className="column group flow-root cursor-pointer rounded-md
                                        border-[1px] border-gray-300 dark:border-brand-light"
                                    >
                                        {movie.poster ? (
                                            <Tooltip>
                                                <Tooltip.Trigger>
                                                    <div className="relative">
                                                        {!editingMode ? (
                                                            <Link
                                                                href={{
                                                                    pathname:
                                                                        "/film/[id]",
                                                                    query: {
                                                                        id: movie.movieId,
                                                                    },
                                                                }}
                                                            >
                                                                <div>
                                                                    <Image
                                                                        alt={
                                                                            movie.title
                                                                        }
                                                                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                                                        className={clxsm(
                                                                            editingMode &&
                                                                                "opacity-40",
                                                                            "rounded-md"
                                                                        )}
                                                                        width={
                                                                            0
                                                                        }
                                                                        height={
                                                                            0
                                                                        }
                                                                        sizes="100vw"
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "auto",
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            <div
                                                                onClick={() =>
                                                                    setIdsToRemove(
                                                                        [
                                                                            ...idsToRemove,
                                                                            id,
                                                                        ]
                                                                    )
                                                                }
                                                            >
                                                                <div
                                                                    className="pointer-events-none absolute 
                                                            left-[50%] top-[50%]
                                                            z-50 h-full
                                                            w-full -translate-x-1/2 -translate-y-1/2 
                                                            text-center text-red-400"
                                                                >
                                                                    <BsX className="h-full w-full" />
                                                                </div>
                                                                <div>
                                                                    <Image
                                                                        alt={
                                                                            movie.title
                                                                        }
                                                                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                                                        className={clxsm(
                                                                            editingMode &&
                                                                                "opacity-40",
                                                                            "rounded-md"
                                                                        )}
                                                                        width={
                                                                            0
                                                                        }
                                                                        height={
                                                                            0
                                                                        }
                                                                        sizes="100vw"
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "auto",
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Tooltip.Trigger>
                                                <Tooltip.Content>
                                                    <div className="flex space-x-2">
                                                        <p
                                                            className={clxsm([
                                                                "overflow-hidden text-ellipsis text-xs",
                                                                "font-semibold text-crumble-base group-hover:text-crumble-base",
                                                            ])}
                                                        >
                                                            {movie.releaseDate.slice(
                                                                0,
                                                                4
                                                            )}
                                                        </p>
                                                        <p
                                                            className="overflow-hidden text-ellipsis text-xs 
                                                                    text-sky-lighter group-hover:text-crumble-base"
                                                        >
                                                            {movie.title}
                                                        </p>
                                                    </div>
                                                </Tooltip.Content>
                                            </Tooltip>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        {session?.user.id === author.id && !editingMode ? (
                            <AddMovieToList listId={listData.id} />
                        ) : null}
                    </div>
                    <div className="mt-4 flex space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <BsHeartFill
                            onClick={handleToggleLike}
                            className={clxsm(
                                list.list.likedByMe
                                    ? "fill-crumble"
                                    : "fill-gray-600 dark:fill-gray-300",
                                "mt-[5px] h-4 w-4 cursor-pointer hover:fill-crumble hover:dark:fill-crumble"
                            )}
                        />
                        <div className="mt-[3px] flex space-x-1">
                            <p>{list.list.likeCount}</p>
                            <p>likes</p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default SingleListView;
