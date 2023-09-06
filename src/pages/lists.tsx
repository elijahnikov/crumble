import CreateListModal from "@/components/common/CreateListModal/CreateListModal";
import Layout, { Container } from "@/components/common/Layout/Layout";
import PopularLists from "@/components/common/Pages/Lists/AllListsPage/PopularLists";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const AllListsPage = () => {
    return (
        <>
            <Head>
                <title>Movie Lists - Crumble</title>
            </Head>
            <Layout>
                <Container>
                    <Header />
                    <PopularLists />
                </Container>
            </Layout>
        </>
    );
};

export default AllListsPage;

const Header = () => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="relative">
            <div className="absolute z-10 h-[100%] w-[100%] text-center before:content-['']">
                <h1 className="mt-[80px] inline-block">
                    Your place to organise <br /> what you want to see most.
                </h1>
                <div className="mt-2">
                    <CreateListModal open={open} setOpen={setOpen} />
                </div>
            </div>
            <Image
                width={0}
                height={0}
                sizes="100vw"
                src={`https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg`}
                alt={"list background"}
                className="h-[250px] max-w-[100%] rounded-lg object-cover opacity-60 duration-[0.5s] dark:opacity-50"
                priority
                style={{ width: "100%" }}
                onLoadingComplete={(image) =>
                    image.classList.remove("opacity-0")
                }
            />
        </div>
    );
};
