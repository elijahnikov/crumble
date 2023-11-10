import Layout, { Container } from "@/components/common/Layout/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { Select } from "@/components/ui/Select/Select";
import {
    type IAllMovieDetailsFetch,
    allMovieDetailsFetchSchema,
} from "@/server/api/schemas/movie";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { type ZodType } from "zod";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import CastSearch from "@/components/common/Pages/AllMovies/CastSearch/CastSearch";

const decades = {
    2020: ["2020-01-01", "2029-12-31"],
    2010: ["2010-01-01", "2019-12-31"],
    2000: ["2000-01-01", "2009-12-31"],
    1990: ["1990-01-01", "1999-12-31"],
    1980: ["1980-01-01", "1989-12-31"],
    1970: ["1970-01-01", "1979-12-31"],
    1960: ["1960-01-01", "1969-12-31"],
    1950: ["1950-01-01", "1959-12-31"],
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

    const [decade, setDecade] = useState<string>("All");
    const [genre, setGenre] = useState<string>(genres[0]!.name);
    const [sort, setSort] = useState<string>("Release date");

    const getUrl = useCallback(() => {
        let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}`;

        if (router.query.sort) {
            const sortId = sortings.find(
                (sorting) => sorting.name === router.query.sort
            )?.id;
            url += `&sort_by=${sortId}.desc`;
        }
        if (router.query.decade && router.query.decade !== "All") {
            const decade = String(router.query.decade);
            const dates = decades[decade as unknown as keyof typeof decades];
            url += `&primary_release_date.gte=${dates[0]}&primary_release_date.lte=${dates[1]}`;
        }
        if (router.query.genre && router.query.genre !== "Any") {
            const genreId = genres.find(
                (genre) => genre.name === router.query.genre
            )?.id;
            url += `&with_genres=${genreId}`;
        }
        return url;
    }, [page, router.query.decade, router.query.genre, router.query.sort]);

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

    useEffect(() => {
        void fetchAllMovies();
    }, [router.query, fetchAllMovies, page, page2]);

    useEffect(() => {
        setDecade(router.query.decade ? String(router.query.decade) : "All");
        setSort(router.query.sort ? String(router.query.sort) : "Release date");
        setGenre(router.query.genre ? String(router.query.genre) : "Any");
    }, [router.query.genre, router.query.sort, router.query.decade]);
    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <h3 className="mb-4">Discover movies</h3>
                    <div className="flex space-x-2">
                        <CastSearch />
                        <Select
                            label="Decade"
                            size="sm"
                            value={decade}
                            setValue={setDecade}
                        >
                            {[...Object.keys(decades), "All"]
                                .reverse()
                                .map((decade, index) => (
                                    <Select.Item
                                        size="sm"
                                        key={index}
                                        value={`${decade}s`}
                                        onClick={() =>
                                            void router.replace({
                                                pathname: "/movies/all/",
                                                query: {
                                                    decade,
                                                    genre:
                                                        router.query.genre ??
                                                        "",
                                                    sort:
                                                        router.query.sort ?? "",
                                                },
                                            })
                                        }
                                    >
                                        {decade === "All"
                                            ? decade
                                            : `${decade}s`}
                                    </Select.Item>
                                ))}
                        </Select>
                        <Select
                            label="Genre"
                            size="sm"
                            value={genre}
                            setValue={setGenre}
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
                                                decade:
                                                    router.query.decade ?? "",
                                                genre: genre.name,
                                                sort: router.query.sort ?? "",
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
                            value={sort}
                            setValue={setSort}
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
                                                decade:
                                                    router.query.decade ?? "",
                                                genre: router.query.genre ?? "",
                                                sort: sorting.name,
                                            },
                                        })
                                    }
                                >
                                    {sorting.name}
                                </Select.Item>
                            ))}
                        </Select>
                    </div>
                    {loading && (
                        <div className="mx-auto mt-10 flex w-full justify-center text-center">
                            <LoadingSpinner size={35} />
                        </div>
                    )}
                    {!loading && (
                        <>
                            <div className="mt-5 grid  w-full grid-cols-10 gap-3 border-t-[1px] py-2 dark:border-slate-700">
                                {movieData.map((movie) => (
                                    <div
                                        key={movie.movieId}
                                        className="w-[100%]"
                                    >
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
                                                            ? `${movie.title.slice(
                                                                  0,
                                                                  25
                                                              )}...`
                                                            : movie.title}
                                                    </p>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
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
