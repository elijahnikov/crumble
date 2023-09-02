import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
    NextPage,
} from "next";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SingleListPage: NextPage<PageProps> = ({ id }) => {
    const trpcUtils = api.useContext();

    const { data, isLoading } = api.list.list.useQuery({ id });

    return <></>;
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const helpers = await generateSSGHelper();

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("No slug");

    await helpers.list.list.prefetch({ id });

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

export default SingleListPage;
