import { type RouterOutputs } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";

const FavouriteMovies = ({
    user,
    isMe,
    data,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe?: boolean;
    data: RouterOutputs["user"]["getFavouriteMoviesForUser"];
}) => {
    return (
        <div>
            <div className="flex">
                <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                    Favourite movies
                </p>
                {isMe && (
                    <Link
                        href="/[username]/settings"
                        as={`/@${user.name}/settings`}
                    >
                        <p className="mt-1 cursor-pointer text-xs font-normal text-crumble underline">
                            Edit
                        </p>
                    </Link>
                )}
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />

            {data.length === 0 ? (
                <p className="pt-1 text-sm font-normal">
                    Showcase your favourite films here...
                    <Link
                        href="/[username]/settings"
                        as={`/@${user.name}/settings`}
                    >
                        <span className="pl-1 text-crumble underline">
                            Settings
                        </span>
                    </Link>
                </p>
            ) : (
                <div className="mt-2 h-max w-full columns-5 gap-2">
                    {data?.slice(0, 5).map(({ movie, id }) => (
                        <div
                            key={id}
                            className=" break-inside-avoid-column pb-5"
                        >
                            <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-200 dark:border-brand-light">
                                {movie.poster ? (
                                    <Image
                                        className="rounded-md"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                        }}
                                        alt={`${movie.title}`}
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                    />
                                ) : (
                                    <div className="mb-5 mt-5 text-center">
                                        ?
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavouriteMovies;
