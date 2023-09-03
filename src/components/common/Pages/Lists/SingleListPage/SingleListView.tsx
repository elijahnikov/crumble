import { Container } from "@/components/common/Layout/Layout";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { type RouterOutputs, api } from "@/utils/api";
import clxsm from "@/utils/clsxm";
import { fromNow } from "@/utils/general/dateFormat";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { BsHeartFill } from "react-icons/bs";

interface SingleListViewProps {
    list: RouterOutputs["list"]["list"];
}

const SingleListView = ({ list }: SingleListViewProps) => {
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
                        <span>{author.name}</span>
                    </div>
                    <div>
                        <div>Created {fromNow(listData.createdAt)}</div>
                        <h3>{listData.title}</h3>
                        <p>{listData.description}</p>
                        {listData.numberOfFilms === 0 ? (
                            <p>No movies added yet.</p>
                        ) : (
                            <p>{listData.numberOfFilms} movies in this list.</p>
                        )}
                    </div>
                    <div className="grid w-full grid-cols-5 gap-2">
                        {listData.listEntries.map(({ movie }) => (
                            <div
                                className=" break-inside-avoid-column"
                                key={movie.movieId}
                            >
                                <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                                    {movie.poster ? (
                                        <Tooltip>
                                            <Tooltip.Trigger>
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
