import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
    type IAllMovieDetailsFetch,
    allMovieDetailsFetchSchema,
} from "@/server/api/schemas/movie";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { useState, useEffect } from "react";
import { type ZodType } from "zod";
import MovieImage from "../../AllMovies/MovieImage/MovieImage";

const TrendingThisWeek = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [trendingMovieData, setTrendingMovieData] = useState<
        IAllMovieDetailsFetch[]
    >([]);

    const fetchAllMovies = async () => {
        setLoading(true);
        const url =
            "https://api.themoviedb.org/3/trending/movie/week?language=en-US";

        const data = (await fetchWithZod(
            url,
            allMovieDetailsFetchSchema as ZodType
        )) as IAllMovieDetailsFetch[];

        if (data) setTrendingMovieData(data);

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    };

    useEffect(() => {
        void fetchAllMovies();
    }, []);

    return (
        <div>
            <div>
                <h4 className="text-sm text-slate-600 dark:text-slate-400">
                    Trending this week
                </h4>
            </div>
            {loading && (
                <div className="mx-auto mt-5 flex w-full justify-center text-center">
                    <LoadingSpinner size={30} />
                </div>
            )}
            {!loading && (
                <div className="grid w-full grid-cols-6 gap-3 py-2 dark:border-slate-700">
                    {trendingMovieData.slice(0, 6).map((movie) => (
                        <MovieImage key={movie.movieId} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrendingThisWeek;
