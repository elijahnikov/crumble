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
import { BsCheck, BsHeartFill, BsPencilFill } from "react-icons/bs";
import AddMovieToList from "./AddMovieToList";
import { useState } from "react";
import IconButton from "@/components/ui/IconButton/IconButton";

interface SingleListViewProps {
    list: RouterOutputs["list"]["list"];
}

const SingleListView = ({ list }: SingleListViewProps) => {
    const [editingMode, setEditingMode] = useState<boolean>(false);

    const { list: listData } = list;
    const { user: author } = listData;

    const { data: session } = useSession();
    const authenticated = !!session;

    const trpcUtils = api.useContext();

    const toggleLike = api.list.toggleListLike.useMutation({
        onSuccess: async () => {
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
                            <h3 className="mt-4">{listData.title}</h3>
                            {!editingMode ? (
                                <IconButton
                                    size={"sm"}
                                    intent={"primary"}
                                    className="float-right ml-4 mt-4 bg-none fill-crumble"
                                    onClick={() => setEditingMode(true)}
                                >
                                    <BsPencilFill />
                                </IconButton>
                            ) : (
                                <div>
                                    <IconButton
                                        size={"sm"}
                                        intent={"primary"}
                                        className="float-right ml-4 mt-4 fill-crumble"
                                        onClick={() => setEditingMode(false)}
                                    >
                                        {/*  */}
                                        <BsCheck />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                        <p className="mb-2 mt-1 text-slate-600 dark:text-slate-300">
                            {listData.description}
                        </p>
                        {listData.tags ? (
                            <ShowTags tags={listData.tags} />
                        ) : null}
                    </div>
                    <div className="mt-5 grid w-full grid-cols-5 gap-2">
                        {listData.listEntries.map(({ movie }) => (
                            <div
                                className=" break-inside-avoid-column"
                                key={movie.movieId}
                            >
                                <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                                    {movie.poster ? (
                                        <Tooltip>
                                            <Tooltip.Trigger>
                                                <Link
                                                    href={{
                                                        pathname: "/film/[id]",
                                                        query: {
                                                            id: movie.movieId,
                                                        },
                                                    }}
                                                >
                                                    <Image
                                                        alt={movie.title}
                                                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                                        className="rounded-md"
                                                        width={0}
                                                        height={0}
                                                        sizes="100vw"
                                                        style={{
                                                            width: "100%",
                                                            height: "auto",
                                                        }}
                                                    />
                                                </Link>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content>
                                                <div className="flex space-x-2">
                                                    <p className="overflow-hidden text-ellipsis text-xs font-semibold text-crumble-base group-hover:text-crumble-base">
                                                        {movie.releaseDate.slice(
                                                            0,
                                                            4
                                                        )}
                                                    </p>
                                                    <p className="overflow-hidden text-ellipsis text-xs text-sky-lighter group-hover:text-crumble-base">
                                                        {movie.title}
                                                    </p>
                                                </div>
                                            </Tooltip.Content>
                                        </Tooltip>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                        {session?.user.id === author.id ? (
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
