import Layout, { Container } from "@/components/common/Layout/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { Select } from "@/components/ui/Select/Select";
import {
    type IAllMovieDetailsFetch,
    allMovieDetailsFetchSchema,
    type ICastSearch,
} from "@/server/api/schemas/movie";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import Head from "next/head";
import Link from "next/link";

import { useCallback, useEffect, useState } from "react";
import { type ZodType } from "zod";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import CastSearch, {
    ChosenCastPill,
} from "@/components/common/Pages/AllMovies/CastSearch/CastSearch";
import MovieImage from "@/components/common/Pages/AllMovies/MovieImage/MovieImage";
import { useRouter } from "next/router";
import { useGetURLParam } from "@/utils/hooks/useGetURLParam";

const decades = {
    "2020s": ["2020-01-01", "2029-12-31"],
    "2010s": ["2010-01-01", "2019-12-31"],
    "2000s": ["2000-01-01", "2009-12-31"],
    "1990s": ["1990-01-01", "1999-12-31"],
    "1980s": ["1980-01-01", "1989-12-31"],
    "1970s": ["1970-01-01", "1979-12-31"],
    "1960s": ["1960-01-01", "1969-12-31"],
    "1950s": ["1950-01-01", "1959-12-31"],
};

const genres = [
    {
        id: 200000000,
        name: "Any",
    },
    {
        id: 28,
        name: "Action",
    },
    {
        id: 12,
        name: "Adventure",
    },
    {
        id: 16,
        name: "Animation",
    },
    {
        id: 35,
        name: "Comedy",
    },
    {
        id: 80,
        name: "Crime",
    },
    {
        id: 99,
        name: "Documentary",
    },
    {
        id: 18,
        name: "Drama",
    },
    {
        id: 10751,
        name: "Family",
    },
    {
        id: 14,
        name: "Fantasy",
    },
    {
        id: 36,
        name: "History",
    },
    {
        id: 27,
        name: "Horror",
    },
    {
        id: 10402,
        name: "Music",
    },
    {
        id: 9648,
        name: "Mystery",
    },
    {
        id: 10749,
        name: "Romance",
    },
    {
        id: 878,
        name: "Science Fiction",
    },
    {
        id: 10770,
        name: "TV Movie",
    },
    {
        id: 53,
        name: "Thriller",
    },
    {
        id: 10752,
        name: "War",
    },
    {
        id: 37,
        name: "Western",
    },
];

const sortings = [
    {
        id: "primary_release_date",
        name: "Release date",
    },
    {
        id: "popularity",
        name: "Popularity",
    },
];

const MoviesAllPage = () => {
    const router = useRouter();

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
                        <CastSearch
                            chosenCast={chosenCast}
                            setChosenCast={setChosenCast}
                            handleRemove={handleRemove}
                        />
                        <Select
                            label="Decade"
                            size="sm"
                            value={String(decade)}
                            setValue={() => null}
                        >
                            {["All", ...Object.keys(decades)].map(
                                (decade, index) => (
                                    <Select.Item
                                        size="sm"
                                        key={index}
                                        value={`${decade}`}
                                        onClick={() => {
                                            if (decade === "All") {
                                                const { query, pathname } =
                                                    router;
                                                delete query.decade;
                                                void router.replace({
                                                    pathname,
                                                    query,
                                                });
                                            } else {
                                                void router.replace({
                                                    pathname: "/movies/all/",
                                                    query: {
                                                        ...router.query,
                                                        decade,
                                                    },
                                                });
                                            }
                                        }}
                                    >
                                        {decade}
                                    </Select.Item>
                                )
                            )}
                        </Select>
                        <Select
                            label="Genre"
                            size="sm"
                            value={String(genre)}
                            setValue={() => null}
                        >
                            {genres.map((genre, index) => (
                                <Select.Item
                                    size="sm"
                                    key={index}
                                    value={genre.name}
                                    onClick={() =>
                                        void router.replace({
                                            pathname: "/movies/all/",
                                            query: {
                                                ...router.query,
                                                genre: genre.name,
                                            },
                                        })
                                    }
                                >
                                    {genre.name}
                                </Select.Item>
                            ))}
                        </Select>
                        <Select
                            label="Sort by"
                            size="sm"
                            value={String(sort)}
                            setValue={() => null}
                        >
                            {sortings.map((sorting, index) => (
                                <Select.Item
                                    size="sm"
                                    key={index}
                                    value={sorting.name}
                                    onClick={() =>
                                        void router.replace({
                                            pathname: "/movies/all/",
                                            query: {
                                                ...router.query,
                                                sort: sorting.name,
                                            },
                                        })
                                    }
                                >
                                    {sorting.name}
                                </Select.Item>
                            ))}
                        </Select>
                        <div className="mt-[18px]">
                            {Object.keys(router.query).length > 0 && (
                                <Button
                                    onClick={() => {
                                        const { pathname } = router;
                                        void router.replace({
                                            pathname,
                                        });
                                    }}
                                    intent={"secondary"}
                                    size="sm"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
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
                            <div className="mt-5 grid w-full grid-cols-10 gap-3 border-t-[1px] py-2 dark:border-slate-700">
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
