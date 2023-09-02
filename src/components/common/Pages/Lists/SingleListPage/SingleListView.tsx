import { Container } from "@/components/common/Layout/Layout";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { RouterOutputs, api } from "@/utils/api";
import { fromNow } from "@/utils/general/dateFormat";
import Image from "next/image";

interface SingleListViewProps {
    list: RouterOutputs["list"]["list"];
}

const SingleListView = ({ list }: SingleListViewProps) => {
    const { list: listData } = list;
    const { user: author } = listData;

    const trpcUtils = api.useContext();

    return (
        <>
            <Container>
                <div>
                    <div className="flex">
                        {listData.user.image ? (
                            <Image
                                className="rounded-full"
                                alt={listData.user.name!}
                                src={listData.user.image}
                                width={30}
                                height={30}
                            />
                        ) : null}
                        <span>{listData.user.name}</span>
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
                </div>
            </Container>
        </>
    );
};

export default SingleListView;
