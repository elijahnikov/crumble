import Layout, { Container } from "@/components/common/Layout/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
    IPersonDetailsFetch,
    personDetailsFetchSchema,
} from "@/server/api/schemas/person";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import type {
    InferGetStaticPropsType,
    GetStaticPaths,
    GetStaticPropsContext,
    NextPage,
} from "next";
import { useEffect, useState } from "react";
import { ZodType } from "zod";

const PersonPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    name,
    type,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [personDetails, setPersonDetails] = useState<IPersonDetailsFetch[]>(
        []
    );

    const fetchPersonDetails = async () => {
        setLoading(true);
        if (name && name !== "") {
            const url = `https://api.themoviedb.org/3/person/${
                name.split("-")[1]
            }?language=en-US`;

            const data = (await fetchWithZod(
                url,
                personDetailsFetchSchema as ZodType
            )) as IPersonDetailsFetch[];

            if (data) setPersonDetails(data);
        }

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    };

    useEffect(() => {
        void fetchPersonDetails();
    }, []);

    return (
        <>
            <Layout>
                <Container>{loading && <LoadingSpinner />}</Container>
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
