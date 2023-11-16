import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
    allMovieDetailsFetchSchema,
    type IAllMovieDetailsFetch,
} from "@/server/api/schemas/movie";
import { api } from "@/utils/api";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { type ZodType } from "zod";
import MovieImage from "../../AllMovies/MovieImage/MovieImage";

const Recommended = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [recommendedMovies, setRecommendedMovies] = useState<
        IAllMovieDetailsFetch[]
    >([]);

    const { data: session } = useSession();

    const { data: watched, isLoading } = api.watched.watched.useQuery({
        limit: 1,
        sortBy: "createdAt",
        username: session ? session.user.name! : "",
    });

    const fetchAllMovies = async () => {
        setLoading(true);
        console.log(watched);
        if (watched && watched.watched.length > 0) {
            const url = `https://api.themoviedb.org/3/movie/${watched.watched[0]?.movieId}/recommendations?language=en-US&page=1`;

            const data = (await fetchWithZod(
                url,
                allMovieDetailsFetchSchema as ZodType
            )) as IAllMovieDetailsFetch[];

            if (data) setRecommendedMovies(data);
        }

        console.log(recommendedMovies);
        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    };

    const loadingCheck = isLoading || loading;

    useEffect(() => {
        if (watched && watched.watched.length > 0) void fetchAllMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watched]);

    return (
        <div>
            <div className="flex">
                <h4 className="text-sm text-slate-600 dark:text-slate-400">
                    Recommended for you
                </h4>
                {!loadingCheck &&
                    watched &&
                    watched.watched.length > 0 &&
                    recommendedMovies.length > 0 && (
                        <p className="ml-2 mt-[2px] text-xs dark:text-slate-500">
                            Recommendations based on your recent watch of{" "}
                            <span className="text-crumble">
                                {watched.watched[0]?.movieTitle}
                            </span>
                        </p>
                    )}
            </div>
            {loadingCheck && (
                <div className="mx-auto mt-5 flex w-full justify-center text-center">
                    <LoadingSpinner size={30} />
                </div>
            )}
            {!loadingCheck && watched && watched.watched.length === 0 && (
                <div className="mx-auto mt-10 h-[50px] w-full justify-center text-center text-sm">
                    <p className="dark:text-slate-500">
                        To get movie recommendations, add to your watched
                        movies!
                    </p>
                </div>
            )}
            {!loadingCheck &&
                watched &&
                watched.watched.length > 0 &&
                recommendedMovies.length > 0 && (
                    <div className="grid w-full grid-cols-6 gap-3 py-2 dark:border-slate-700">
                        {recommendedMovies.slice(0, 6).map((movie) => (
                            <MovieImage key={movie.movieId} movie={movie} />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default Recommended;
