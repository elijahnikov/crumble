import Layout, { Container } from "@/components/common/Layout/Layout";
import RecentlyReviewed from "@/components/common/Pages/Movies/MoviesHomePage/RecentlyReviewed/RecentlyReviewed";
import Recommended from "@/components/common/Pages/Movies/MoviesHomePage/Recommended/Recommended";
import TrendingThisWeek from "@/components/common/Pages/Movies/MoviesHomePage/TrendingThisWeek/TrendingThisWeek";
import Head from "next/head";

const MoviesHomePage = () => {
    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <h2>Movies</h2>
                    <div className="h-[20px]" />
                    <TrendingThisWeek />
                    <div className="h-[20px]" />
                    <Recommended />
                    <div className="h-[20px]" />
                    <RecentlyReviewed />
                </Container>
            </Layout>
        </>
    );
};

export default MoviesHomePage;
