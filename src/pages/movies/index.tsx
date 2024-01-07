import Layout, { Container } from "@/components/common/Layout/Layout";
import Header from "@/components/common/Pages/Movies/MoviesHomePage/Header/Header";
import RecentlyReviewed from "@/components/common/Pages/Movies/MoviesHomePage/RecentlyReviewed/RecentlyReviewed";
import Recommended from "@/components/common/Pages/Movies/MoviesHomePage/Recommended/Recommended";
import TopReviews from "@/components/common/Pages/Movies/MoviesHomePage/TopReviews/TopReviews";
import TrendingThisWeek from "@/components/common/Pages/Movies/MoviesHomePage/TrendingThisWeek/TrendingThisWeek";
import Head from "next/head";

const MoviesHomePage = () => {
    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <Header />
                    <div className="h-[20px]" />
                    <TrendingThisWeek />
                    <div className="h-[20px]" />
                    <Recommended />
                    <div className="h-[20px]" />
                    <RecentlyReviewed />
                    <div className="h-[20px]" />
                    <TopReviews />
                </Container>
            </Layout>
        </>
    );
};

export default MoviesHomePage;
