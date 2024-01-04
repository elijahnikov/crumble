import { MovieSearchResultsMini } from "@/components/common/CreateReviewModal/CreateReviewModal";
import Input from "@/components/ui/Input/Input";
import { movieFetchSchema, type IMovieFetch } from "@/server/api/schemas/movie";
import clxsm from "@/utils/clsxm";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import useIsMobile from "@/utils/hooks/useIsMobile";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { type ZodType } from "zod";

const MovieSearch = () => {
    const router = useRouter();
    const isMobile = useIsMobile();

    const [movieFetchData, setMovieFetchData] = useState<IMovieFetch[]>([]);

    const [searchText, setSearchText] = useState<string>("");

    const fetchMoviesFromSearchTerm = useCallback(async () => {
        if (searchText !== "") {
            const data = await fetchWithZod(
                `https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=en-US'`,
                movieFetchSchema as ZodType
            );
            setMovieFetchData(data);
        } else setMovieFetchData([]);
    }, [searchText]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            void fetchMoviesFromSearchTerm();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [fetchMoviesFromSearchTerm, searchText]);

    return (
        <div>
            <Input
                className={clxsm(
                    isMobile && "-mt-[5px]",
                    "w-[130px] md:w-[200px]"
                )}
                size={"sm"}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="search movies..."
            />
            {movieFetchData.length > 0 && (
                <div className="absolute right-20 max-w-[400px]">
                    <MovieSearchResultsMini
                        filmSearchResults={movieFetchData}
                        handleMovieClick={(e) =>
                            void router.push(
                                {
                                    pathname: "/movie/[id]",
                                    query: {
                                        id: e.movieId,
                                    },
                                },
                                undefined,
                                { shallow: false }
                            )
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default MovieSearch;
