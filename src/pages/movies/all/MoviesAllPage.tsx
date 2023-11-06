import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export const MoviesAllPage = () => {
        const router = useRouter();
        console.log(router.query);

        const [movieData, setMovieData] = useState([]);

        const fetchMoviesFromSearchTerm = useCallback(async () => {
            const data = await fetchWithZod(
                `https://api.themoviedb.org/3/search/movie?query=${searchedMovieName}&include_adult=false&language=en-US'`
            );
        });
    },
    [router, query];
