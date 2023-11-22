import Layout, { Container } from "@/components/common/Layout/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
    type IPersonCreditsFetch,
    type IPersonDetailsFetch,
    personCreditsSchema,
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
import { type ZodType } from "zod";
import Image from "next/image";

const jobHeadingMapping: Record<string, string> = {
    actor: "Movies starring",
    executive_producer: "Movies executive produced by",
    producer: "Movies produced by",
    director: "Movies directed by",
    editor: "Movies edited by",
};

const PersonPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    name,
    type,
}) => {
    const formattedName = name.split("-")[0];
    const personId = name.split("-")[1];
    const [loading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<IPersonDetailsFetch>();
    const [credits, setCredits] = useState<IPersonCreditsFetch[]>([]);

    const fetchPersonDetails = async () => {
        setLoading(true);
        if (name && name !== "") {
            const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;

            const data = (await fetchWithZod(
                url,
                personDetailsFetchSchema as ZodType
            )) as IPersonDetailsFetch;

            if (data) setDetails(data);
        }

        if (name && name !== "") {
            const url = `https://api.themoviedb.org/3/person/${personId}/movie_credits?language=en-US`;
            const data = (await fetchWithZod(
                url,
                personCreditsSchema as ZodType
            )) as IPersonCreditsFetch[];

            if (data) setCredits(data);
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
                <Container>
                    {loading && <LoadingSpinner />}
                    {jobHeadingMapping[type as keyof typeof jobHeadingMapping]}
                    <h3>{formattedName}</h3>
                    <div className="w-[20%]">
                        <Image
                            alt={formattedName ?? ""}
                            src={`https://image.tmdb.org/t/p/w500/${details?.picture}`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="rounded-md border-t-[1px] opacity-0 duration-[0.5s] dark:border-gray-800"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            onLoadingComplete={(image) =>
                                image.classList.remove("opacity-0")
                            }
                        />
                    </div>
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
