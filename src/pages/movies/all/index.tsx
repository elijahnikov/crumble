import Layout, { Container } from "@/components/common/Layout/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
    type IAllMovieDetailsFetch,
    allMovieDetailsFetchSchema,
    type ICastSearch,
} from "@/server/api/schemas/movie";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import Head from "next/head";

import { useCallback, useEffect, useState } from "react";
import { type ZodType } from "zod";
import Button from "@/components/ui/Button/Button";
import { ChosenCastPill } from "@/components/common/Pages/Movies/AllMovies/CastSearch/CastSearch";
import MovieImage from "@/components/common/Pages/Movies/AllMovies/MovieImage/MovieImage";
import { useGetURLParam } from "@/utils/hooks/useGetURLParam";
import { genres, decades, sortings } from "@/utils/data/constants";
import FilterHeader from "@/components/common/Pages/Movies/AllMovies/FilterHeader/FilterHeader";

const MoviesAllPage = () => {
    const [movieData, setMovieData] = useState<IAllMovieDetailsFetch[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page2, setPage2] = useState(2);

    const [loading, setLoading] = useState<boolean>(false);

    const decade = useGetURLParam("decade") ?? "All";
    const genre = useGetURLParam("genre") ?? genres[0]!.name;
    const sort = useGetURLParam("sort") ?? "Popularity";
    const [chosenCast, setChosenCast] = useState<ICastSearch[]>([]);

    const getUrl = useCallback(() => {
        let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}`;

        if (decade && decade !== "All") {
            const dates = decades[decade as unknown as keyof typeof decades];
            url += `&primary_release_date.gte=${dates[0]}&primary_release_date.lte=${dates[1]}`;
        }
        if (sort && sort !== "") {
            const sorting = sortings.find((s) => s.name === sort)?.id;
            url += `&sort_by=${sorting}.desc`;
        }
        if (chosenCast.length > 0) {
            const castIds = chosenCast
                .map((cast) => {
                    return cast.id;
                })
                .join(",");
            url += `&with_cast=${castIds}`;
        }
        if (genre && genre !== "Any") {
            const genreId = genres.find((g) => g.name === genre)?.id;
            url += `&with_genres=${genreId}`;
        }
        return url;
    }, [page, decade, sort, chosenCast, genre]);

    const fetchAllMovies = useCallback(async () => {
        setLoading(true);
        const url = getUrl();

        const data = (await fetchWithZod(
            url,
            allMovieDetailsFetchSchema as ZodType
        )) as IAllMovieDetailsFetch[];
        const data2 = (await fetchWithZod(
            url.replace(`page=${page}`, `page=${page2}`),
            allMovieDetailsFetchSchema as ZodType
        )) as IAllMovieDetailsFetch[];

        if (data && data2) setMovieData(data.concat(data2));

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    }, [page, page2, getUrl]);

    const handleRemove = (castId: number) => {
        const objectIndex = chosenCast.findIndex(
            (existingObject) => existingObject.id === castId
        );

        if (objectIndex !== -1) {
            const updatedArray = [...chosenCast];
            updatedArray.splice(objectIndex, 1);
            setChosenCast(updatedArray);
        }
    };

    useEffect(() => {
        void fetchAllMovies();
    }, [decade, genre, sort, chosenCast, fetchAllMovies, page, page2]);

    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <h3 className="mb-4">Discover movies</h3>
                    <div className="flex space-x-2">
                        <FilterHeader
                            chosenCast={chosenCast}
                            setChosenCast={setChosenCast}
                            handleRemove={handleRemove}
                            decade={String(decade)}
                            genre={String(genre)}
                            sort={String(sort)}
                        />
                    </div>
                    <div className="-mb-5 mt-2 flex w-full columns-4 flex-wrap gap-1">
                        {chosenCast.map((cast) => (
                            <ChosenCastPill
                                key={cast.id}
                                cast={cast}
                                handleRemove={handleRemove}
                            />
                        ))}
                    </div>

                    {loading && (
                        <div className="mx-auto mt-10 flex w-full justify-center text-center">
                            <LoadingSpinner size={35} />
                        </div>
                    )}
                    {!loading && (
                        <>
                            <div className="mt-5 grid w-full grid-cols-4 gap-3 border-t-[1px] py-2 dark:border-slate-700 sm:grid-cols-8 md:grid-cols-10">
                                {movieData.map((movie) => (
                                    <MovieImage
                                        key={movie.movieId}
                                        movie={movie}
                                    />
                                ))}
                            </div>
                            <div className="flex w-full">
                                <div className="w-full">
                                    <Button
                                        disabled={page <= 1}
                                        onClick={() => {
                                            if (page > 1) {
                                                setPage(
                                                    (prevPage) => prevPage - 2
                                                );
                                                setPage2(
                                                    (prevPage2) => prevPage2 - 2
                                                );
                                            }
                                        }}
                                        size={"sm"}
                                        intent={"secondary"}
                                    >
                                        Previous
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        onClick={() => {
                                            setPage((prevPage) => prevPage + 2);
                                            setPage2(
                                                (prevPage2) => prevPage2 + 2
                                            );
                                        }}
                                        size={"sm"}
                                        intent={"secondary"}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Container>
            </Layout>
        </>
    );
};
export default MoviesAllPage;
