import Link from "next/link";
import Image from "next/image";

const MovieImage = ({
    movie,
}: {
    movie: {
        movieId: number;
        poster: string | null;
        title: string;
    };
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
                        }}
                        alt={`${movie.title}`}
                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    />
                ) : (
                    <div className="align-center mx-auto my-auto h-full justify-center rounded-md border-[1px] text-center dark:border-slate-700">
                        <p className="mt-5 text-xs dark:text-slate-400">
                            {movie.title.length > 25
                                ? `${movie.title.slice(0, 25)}...`
                                : movie.title}
                        </p>
                    </div>
                )}
            </Link>
        </div>
    );
};

export default MovieImage;
