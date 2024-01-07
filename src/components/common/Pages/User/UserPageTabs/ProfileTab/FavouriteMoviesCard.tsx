import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { type TabProps } from "../../MainUserInformation";

const FavouriteMovies = ({ user, isMe, isMobile }: TabProps) => {
    const { data: favouriteMovies, isLoading: favouriteMoviesLoading } =
        api.user.getFavouriteMoviesForUser.useQuery({
            username: user.name!,
        });

    if (favouriteMoviesLoading) {
        return (
            <div>
                <div className="flex">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Favourite movies
                    </p>
                </div>
                <div className="border-b pt-1 dark:border-slate-500" />
                <div className="mt-5 flex justify-center">
                    <LoadingSpinner size={30} />
                </div>
            </div>
        );
    }

    if (!favouriteMovies) {
        return (
            <div className="flex">
                <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                    Favourite movies
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Favourite movies
                </p>
                {isMe && (
                    <Link
                        href="/[username]/settings"
                        as={`/@${user.name}/settings`}
                    >
                        <p className="ml-4 mt-[2px] flex cursor-pointer text-xs font-normal text-crumble underline">
                            Edit
                        </p>
                    </Link>
                )}
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />

            {favouriteMovies.length === 0 ? (
                <p className="pb-3 pt-1 text-sm font-normal text-slate-600 dark:text-slate-400 ">
                    {isMe ? (
                        <div>
                            Showcase your favourite films here...
                            <Link
                                href="/[username]/settings"
                                as={`/@${user.name}/settings`}
                            >
                                <span className="pl-1 text-crumble underline">
                                    Settings
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {user.name} has not added to their favourite movies
                            list yet.
                        </div>
                    )}
                </p>
            ) : (
                <div className="mt-2 h-max w-full columns-2 gap-2 sm:columns-5">
                    {favouriteMovies?.slice(0, 5).map(({ movie, id }) => (
                        <div
                            key={id}
                            className=" break-inside-avoid-column pb-5"
                        >
                            <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-200 dark:border-brand-light">
                                {movie.poster ? (
                                    <Link
                                        href="/movie/[id]/"
                                        as={`/movie/${movie.movieId}`}
                                    >
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
                                    </Link>
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
