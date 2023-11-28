import Layout, { Container } from "@/components/common/Layout/Layout";
import type {
    InferGetStaticPropsType,
    GetStaticPaths,
    GetStaticPropsContext,
    NextPage,
} from "next";
import SinglePersonView from "@/components/common/Pages/People/SinglePersonView/SinglePersonView";

const PersonPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    name,
    type,
}) => {
    return (
        <>
            <Layout>
                <Container>
                    <SinglePersonView name={name} type={type} />
                </Container>
            </Layout>
        </>
    );
};

export default PersonPage;

export const getStaticProps = (context: GetStaticPropsContext) => {
    const type = context.params!.type;
    const name = context.params!.name;

    return {
        props: {
            type,
            name: String(name),
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};
