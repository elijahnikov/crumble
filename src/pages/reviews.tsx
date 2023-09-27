import CreateReviewModal from "@/components/common/CreateReviewModal/CreateReviewModal";
import Layout, { Container } from "@/components/common/Layout/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import PopularReviews from "@/components/common/Pages/Reviews/AllReviews/PopularReviews/PopularReviews";

const AllReviewsPage = () => {
    return (
        <>
            <Head>
                <title>Reviews • Crumble</title>
            </Head>
            <Layout>
                <Container>
                    <Header />
                    <PopularReviews />
                </Container>
            </Layout>
        </>
    );
};

const Header = () => {
    const { data: session } = useSession();
    const authenticated = !!session;
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="relative">
            <div className="absolute z-10 h-[100%] w-[100%] text-center before:content-['']">
                <h1 className="mt-[80px] inline-block text-white [text-shadow:_0_1px_1px_rgb(0_0_0_/_60%)]">
                    Your place to share your thoughts and rate your favourite
                    movies and shows.
                </h1>
                {authenticated && (
                    <div className="mt-2">
                        <CreateReviewModal open={open} setOpen={setOpen} />
                    </div>
                )}
            </div>
            <Image
                width={0}
                height={0}
                sizes="100vw"
                src={`https://image.tmdb.org/t/p/original/xwgBHC2FgoIrQitl8jZwXXdsR9u.jpg`}
                alt={"list background"}
                className="h-[250px] max-w-[100%] rounded-lg object-cover opacity-80  duration-[0.5s] dark:opacity-50"
                priority
                style={{ width: "100%" }}
                onLoadingComplete={(image) =>
                    image.classList.remove("opacity-0")
                }
            />
        </div>
    );
};

export default AllReviewsPage;
