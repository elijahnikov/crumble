import Layout, { Container } from "@/components/common/Layout/Layout";
import { LoadingPage } from "@/components/common/LoadingSpinner/LoadingSpinner";
import PrivacyTab from "@/components/common/Pages/User/UserSettings/PrivacyTab/PrivacyTab";
import ProfileTab from "@/components/common/Pages/User/UserSettings/ProfileTab/ProfileTab";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

const settingsMenu = ["profile", "notifications", "privacy"];

const UserSettingsPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const formattedUsername = String(router.query["@username"]).replace(
        "@",
        ""
    );
    const isCurrentUser = session?.user.name === formattedUsername;

    const [selectedTab, setSelectedTab] = useState(settingsMenu[0]);

    useEffect(() => {
        if (session?.user.name && !isCurrentUser) {
            void router.replace("/");
        }
    }, [isCurrentUser, router, router.query, session?.user.name]);
    const {
        data: user,
        isLoading,
        isError,
    } = api.user.getUserForSettings.useQuery({
        username: formattedUsername,
    });

    if (isError) {
        void router.push("/");
    }

    if (isCurrentUser && isLoading) {
        return (
            <Layout>
                <Container>
                    <LoadingPage />
                </Container>
            </Layout>
        );
    }

    if (isCurrentUser && isError) {
        return (
            <Layout>
                <Container>
                    <h1>Error</h1>
                </Container>
            </Layout>
        );
    }

    if (isCurrentUser && !user) {
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
            {isCurrentUser && (
                <Container>
                    <div>
                        <h2 className="pb-5 text-slate-700 dark:text-slate-200">
                            Settings
                        </h2>
                        <div className="flex">
                            <div className="w-[20%] min-w-[100px]">
                                {settingsMenu.map(
                                    (setting: string, index: number) => (
                                        <div
                                            onClick={() =>
                                                setSelectedTab(setting)
                                            }
                                            key={index}
                                            className={`${
                                                setting === selectedTab
                                                    ? "border-[1px] border-slate-300 bg-brand-white text-crumble dark:border-slate-700 dark:bg-brand"
                                                    : "text-slate-700 dark:text-white"
                                            } mb-2 mt-2 cursor-pointer rounded-md  p-3`}
                                        >
                                            <p className="text-left text-[12px] font-semibold md:text-[12px]">
                                                {setting}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="ml-4 w-[80%] border-l-[1px] p-5 dark:border-slate-700">
                                {selectedTab === "profile" && (
                                    <ProfileTab user={user!} />
                                )}
                                {selectedTab === "notifications" && (
                                    <p>notifications</p>
                                )}
                                {selectedTab === "privacy" && (
                                    <PrivacyTab user={user!} />
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </Layout>
    );
};

export default UserSettingsPage;
