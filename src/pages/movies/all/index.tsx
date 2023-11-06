import Layout from "@/components/common/Layout/Layout";
import {
    IAllMovieDetailsFetch,
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

const MoviesAllPage = () => {
    const router = useRouter();

    const [movieData, setMovieData] = useState<IAllMovieDetailsFetch[]>([]);
    const [page, setPage] = useState<number>(1);

    const fetchMoviesFromSearchTerm = useCallback(async () => {
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
    }, [router.query, page]);

    useEffect(() => {
        void fetchMoviesFromSearchTerm();
    }, [router.query, fetchMoviesFromSearchTerm, page]);
    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <div>hello1</div>
                {JSON.stringify(movieData)}
            </Layout>
        </>
    );
};
export default MoviesAllPage;
