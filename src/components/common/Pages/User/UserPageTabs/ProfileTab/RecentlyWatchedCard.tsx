import { api, type RouterOutputs } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

const RecentlyWatched = ({
    user,
    isMe,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe?: boolean;
}) => {
    const { data: watched, isLoading: recentlyWatchedLoading } =
        api.watched.watched.useQuery({
            username: user.name!,
            limit: 5,
        });

    if (recentlyWatchedLoading) {
        return (
            <div>
                <div className="flex">
                    <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                        Recently watched
                    </p>
                </div>
                <div className="border-b pt-1 dark:border-slate-500" />
                <div className="mt-5 flex justify-center">
                    <LoadingSpinner size={30} />
                </div>
            </div>
        );
    }

    if (!watched) {
        return (
            <div className="flex">
                <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                    Recently watched
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex">
                <p className="w-[91%] text-sm text-slate-600 dark:text-slate-300">
                    Recently watched
                </p>
                <Link href="/[username]/watched" as={`/@${user.name}/watched`}>
                    <p className="ml-1 mt-1 cursor-pointer text-xs font-normal text-crumble underline">
                        See more
                    </p>
                </Link>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />

            {watched.watched.length === 0 ? (
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
                    {watched.watched.slice(0, 5).map((w) => (
                        <div
                            key={w.id}
                            className=" break-inside-avoid-column pb-5"
                        >
                            <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-200 dark:border-brand-light">
                                {w.poster ? (
                                    <Link
                                        href="/movie/[id]/"
                                        as={`/movie/${w.movieId}`}
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
                                            alt={`${w.movieTitle}`}
                                            src={`https://image.tmdb.org/t/p/w500${w.poster}`}
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

export default RecentlyWatched;
