import Layout, { Container } from "@/components/common/Layout/Layout";
import { LoadingPage } from "@/components/common/LoadingSpinner/LoadingSpinner";
import MainUserInformation from "@/components/common/Pages/User/MainUserInformation";
import SingleUserView from "@/components/common/Pages/User/SingleUserView";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import type {
    GetStaticPaths,
    InferGetStaticPropsType,
    GetStaticPropsContext,
    NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ username }) => {
    const [tabFromURL, setTabFromURL] = useState<string>("");
    const { data: session } = useSession();
    const authenticated = !!session;

    const {
        data: user,
        isLoading,
        isError,
    } = api.user.getUser.useQuery({
        username: username!,
    });

    const routeChange = (route: string) => {
        window.history.replaceState(null, "", `/@${username}/${route}`);
        setTabFromURL(route);
    };

    useEffect(() => {
        if (typeof window !== "undefined")
            setTabFromURL(window.location.pathname.split("/")[2]!);
    }, []);

    if (isLoading) {
        return (
            <Layout>
                <Container>
                    <LoadingPage />
                </Container>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <Container>
                    <h1>Error</h1>
                </Container>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <Container>
                    <h1>Not found</h1>
                </Container>
            </Layout>
        );
    }

    const isMe = authenticated && session.user.id === user.id;

    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <SingleUserView
                        authenticated={authenticated}
                        user={user}
                        isMe={isMe}
                    />
                </Container>
                <div className="-mb-[45px]" />
                <Container>
                    <MainUserInformation
                        isMe={isMe}
                        user={user}
                        tabView={tabFromURL}
                        routeChange={routeChange}
                    />
                </Container>
            </Layout>
        </>
    );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const helpers = await generateSSGHelper();

    const username = context.params!["@username"];

    if (!username?.includes("@")) {
        return {
            redirect: {
                destination: "/",
            },
        };
    }

    if (username) {
        const formattedUsername = String(username).replace("@", "");
        await helpers.user.getUser.prefetch({ username: formattedUsername });
        return {
            props: {
                trpcState: helpers.dehydrate(),
                username: formattedUsername,
            },
        };
    } else {
        return {
            props: {},
            notFound: true,
        };
    }
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
