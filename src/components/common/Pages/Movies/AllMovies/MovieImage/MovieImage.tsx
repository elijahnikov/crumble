import Link from "next/link";
import Image from "next/image";

const MovieImage = ({
    movie,
    highlight,
}: {
    movie: {
        movieId: number;
        poster: string | null;
        title: string;
    };
    highlight?: number[];
}) => {
    return (
        <div className="w-[100%]">
            <Link
                href={{
                    pathname: "/movie/[id]",
                    query: {
                        id: movie.movieId,
                    },
                }}
            >
                {movie.poster ? (
                    <Image
                        className="rounded-md"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            width: "100%",
                            height: "auto",
                            opacity:
                                highlight &&
                                typeof highlight !== undefined &&
                                !highlight.includes(movie.movieId)
                                    ? 0.1
                                    : 1,
                        }}
                        alt={`${movie.title}`}
                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    />
                ) : (
                    <div className="relative">
                        <Image
                            className="rounded-md border-[1px] dark:border-slate-700"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "auto",
                                opacity:
                                    highlight &&
                                    typeof highlight !== undefined &&
                                    !highlight.includes(movie.movieId)
                                        ? 0.1
                                        : 0.8,
                            }}
                            alt={`${movie.title}`}
                            src={
                                "https://i.ibb.co/D8SmS99/solid-color-image.png"
                            }
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p
                                style={highlight ? { opacity: 0.1 } : {}}
                                className="text-xs font-semibold text-white"
                            >
                                {movie.title}
                            </p>
                        </div>
                    </div>
                )}
            </Link>
        </div>
    );
};

export default MovieImage;
