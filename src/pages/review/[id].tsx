import Layout from "@/components/common/Layout/Layout";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import type {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
    NextPage,
} from "next";
import Head from "next/head";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SingleReviewPage: NextPage<PageProps> = ({ id }) => {
    const { data, isLoading } = api.review.review.useQuery({ id });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>404</div>;

    return (
        <>
            <Head>
                <title>{`@${data.review.user.name} - ${data.review.movieTitle}`}</title>
            </Head>
            <Layout>
                <h1>{data.review.text}</h1>
            </Layout>
        </>
    );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const helpers = await generateSSGHelper();

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("No slug");

    await helpers.review.review.prefetch({ id });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default SingleReviewPage;
