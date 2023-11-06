import Layout, { Container } from "@/components/common/Layout/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { Select } from "@/components/ui/Select/Select";
import {
    type IAllMovieDetailsFetch,
    allMovieDetailsFetchSchema,
} from "@/server/api/schemas/movie";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { type ZodType } from "zod";

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

const MoviesAllPage = () => {
    const router = useRouter();

    const [movieData, setMovieData] = useState<IAllMovieDetailsFetch[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const [decade, setDecade] = useState<string>("2020s");
    const [genre, setGenre] = useState<string>(genres[0]!.name);

    const fetchAllMovies = useCallback(async () => {
        setLoading(true);
        let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=${page}`;
        if (router.query.decade) {
            const decade = String(router.query.decade);
            const dates = decades[decade as unknown as keyof typeof decades];
            url += `&primary_release_date.gte=${dates[0]}&primary_release_date.lte=${dates[1]}`;
        }
        url += "&sort_by=primary_release_date.asc";
        const data = await fetchWithZod(
            url,
            allMovieDetailsFetchSchema as ZodType
        );
        if (data) setMovieData(data);
        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    }, [router.query, page]);

    useEffect(() => {
        void fetchAllMovies();
    }, [router.query, fetchAllMovies, page]);
    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <div className="flex">
                        <Select
                            label="Decade"
                            size="sm"
                            value={decade}
                            setValue={setDecade}
                        >
                            {Object.keys(decades)
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
                                                },
                                            })
                                        }
                                    >
                                        {decade}s
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
                                            },
                                        })
                                    }
                                >
                                    {genre.name}
                                </Select.Item>
                            ))}
                        </Select>
                    </div>
                    {loading && <LoadingSpinner />}
                    {JSON.stringify(movieData)}
                </Container>
            </Layout>
        </>
    );
};
export default MoviesAllPage;
