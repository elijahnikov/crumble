import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider enableSystem={true} attribute="class">
                <Head>
                    <title>Crumble</title>
                    <meta name="description" content="crumble" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Toaster />
                <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
