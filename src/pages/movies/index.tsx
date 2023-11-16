import Layout, { Container } from "@/components/common/Layout/Layout";
import RecentlyReviewed from "@/components/common/Pages/Movies/MoviesHomePage/RecentlyReviewed/RecentlyReviewed";
import Recommended from "@/components/common/Pages/Movies/MoviesHomePage/Recommended/Recommended";
import TopReviews from "@/components/common/Pages/Movies/MoviesHomePage/TopReviews/TopReviews";
import TrendingThisWeek from "@/components/common/Pages/Movies/MoviesHomePage/TrendingThisWeek/TrendingThisWeek";
import Button from "@/components/ui/Button/Button";
import Head from "next/head";
import Link from "next/link";

const MoviesHomePage = () => {
    return (
        <>
            <Head>Movies • Crumble</Head>
            <Layout>
                <Container>
                    <div className="flex">
                        <h2>Movies</h2>
                        <Link href={"/movies/all/"}>
                            <Button
                                size="sm"
                                className="ml-2 mt-[6px]"
                                intent={"primary"}
                            >
                                Browse all
                            </Button>
                        </Link>
                    </div>
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
