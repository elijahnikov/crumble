import Layout, { Container } from "@/components/common/Layout/Layout";
import { LoadingPage } from "@/components/common/LoadingSpinner/LoadingSpinner";
import ReviewSection from "@/components/common/Pages/Films/SingleFilmPage/ReviewSection/ReviewSection";
import SingleFilmView from "@/components/common/Pages/Films/SingleFilmPage/SingleFilmView/SingleFilmView";
import { api } from "@/utils/api";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import {
    type IMovieDetailsFetchSchema,
    movieDetailsFetchSchema,
} from "@/utils/types/schemas";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SingleFilmPage = () => {
    const router = useRouter();

    const { mutate } = api.movie.createFilm.useMutation();
    const { data } = api.movie.movie.useQuery({
        id: Number(router.query.id),
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [movieData, setMovieData] = useState<
        IMovieDetailsFetchSchema | undefined
    >(undefined);
    const handleFetchMovieDetails = async (id: string) => {
        setLoading(true);
        try {
            const movieData = (await fetchWithZod(
                `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos%2Cimages%2Ccredits%2Calternative_titles%2Cthemes&language=en-US`,
                movieDetailsFetchSchema
            )) as IMovieDetailsFetchSchema;
            setMovieData(movieData);
            if (!data)
                mutate({
                    movieId: movieData.id,
                    overview: movieData.overview,
                    releaseDate: movieData.release_date,
                    title: movieData.original_title,
                    backdrop: movieData.backdrop_path,
                    poster: movieData.poster_path,
                });
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (router.query.id) {
            void handleFetchMovieDetails(String(router.query.id));
        }
    }, [router.query]);

    if (loading) {
        return (
            <Layout>
                <Container>
                    <LoadingPage />
                </Container>
            </Layout>
        );
    }

    if (!movieData || error) {
        return (
            <Layout>
                <Container>
                    <h1>Film not found</h1>
                </Container>
            </Layout>
        );
    }

    return (
        <>
            <Head>
                <title>
                    {`${movieData.title} (${movieData.release_date.slice(
                        0,
                        4
                    )}) • Crumble`}
                </title>
            </Head>
            <Layout>
                <SingleFilmView movieData={movieData} />
                <ReviewSection movieId={movieData.id} />
                <ReviewSection orderBy="reviewLikes" movieId={movieData.id} />
            </Layout>
        </>
    );
};

export default SingleFilmPage;
