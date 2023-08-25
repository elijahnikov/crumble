import Layout from "@/components/common/Layout/Layout";
import SingleFilmView from "@/components/common/Pages/Films/SingleFilmPage/SingleFilmView";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { movieDetailsFetchSchema } from "@/utils/types/schemas";
import type {
    InferGetStaticPropsType,
    NextPage,
    GetStaticPropsContext,
    GetStaticPaths,
} from "next";
import Head from "next/head";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SingleFilmPage: NextPage<PageProps> = ({ movieData }) => {
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
            </Layout>
        </>
    );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("No slug");

    const movieData = await fetchWithZod(
        `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos%2Cimages%2Ccredits%2Calternative_titles%2Cthemes&language=en-US`,
        movieDetailsFetchSchema
    );

    return {
        props: {
            movieData,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default SingleFilmPage;
