import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import type {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
    NextPage,
} from "next";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const AllMembersBySortingPage: NextPage<PageProps> = () => {
    return <></>;
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const helpers = await generateSSGHelper();

    const sorting = context.params?.sorting;

    if (typeof sorting !== "string") throw new Error("No slug");

    await helpers.members.members.prefetchInfinite({ orderBy: sorting });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            sorting,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export default AllMembersBySortingPage;
