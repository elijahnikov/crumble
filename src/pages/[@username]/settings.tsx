import Layout, { Container } from "@/components/common/Layout/Layout";
import { LoadingPage } from "@/components/common/LoadingSpinner/LoadingSpinner";
import ProfileTab from "@/components/common/Pages/User/UserSettings/ProfileTab";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import type {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
    NextPage,
} from "next";
import { useState } from "react";

const settingsMenu = ["profile", "notifications", "privacy"];

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const UserSettingsPage: NextPage<PageProps> = ({ username }) => {
    const {
        data: user,
        isLoading,
        isError,
    } = api.user.getUser.useQuery({
        username: username!,
    });

    const [selectedTab, setSelectedTab] = useState(settingsMenu[0]);

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
    return (
        <Layout>
            <Container>
                <div>
                    <h2 className="pb-5 text-slate-700 dark:text-slate-200">
                        Settings
                    </h2>
                    <div className="flex">
                        <div className="w-[20%]">
                            {settingsMenu.map(
                                (setting: string, index: number) => (
                                    <div
                                        onClick={() => setSelectedTab(setting)}
                                        key={index}
                                        className={`${
                                            setting === selectedTab
                                                ? "border-[1px] border-slate-300 bg-brand-white  text-crumble dark:border-slate-700 dark:bg-brand"
                                                : "text-slate-700 dark:text-white"
                                        } mb-2 mt-2 cursor-pointer rounded-md  p-3`}
                                    >
                                        <p className="text-left font-semibold">
                                            {setting}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="ml-4 w-[80%] border-l-[1px] p-5 dark:border-slate-700">
                            {selectedTab === "profile" && (
                                <ProfileTab user={user} />
                            )}
                            {selectedTab === "notifications" && (
                                <p>notifications</p>
                            )}
                            {selectedTab === "privacy" && <p>privacy</p>}
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
};

export default UserSettingsPage;

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
