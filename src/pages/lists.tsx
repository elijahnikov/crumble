import CreateListModal from "@/components/common/CreateListModal/CreateListModal";
import Layout, { Container } from "@/components/common/Layout/Layout";
import ListTags from "@/components/common/Pages/Lists/ListsHomePage/ListTags";
import PopularLists from "@/components/common/Pages/Lists/ListsHomePage/PopularLists";
import RecentLists from "@/components/common/Pages/Lists/ListsHomePage/RecentLists";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const AllListsPage = () => {
    return (
        <>
            <Head>
                <title>Movie Lists • Crumble</title>
            </Head>
            <Layout>
                <Container>
                    <Header />
                    <PopularLists />
                    <div className="flex">
                        <div className="w-[70%]">
                            <RecentLists />
                        </div>
                        <div className="hidden w-[29%] lg:block">
                            <ListTags />
                        </div>
                    </div>
                </Container>
            </Layout>
        </>
    );
};

export default AllListsPage;

const Header = () => {
    const { data: session } = useSession();
    const authenticated = !!session;
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="relative">
            <div className="absolute z-10 h-[100%] w-[100%] text-center before:content-['']">
                <h1 className="mt-[80px] inline-block text-white [text-shadow:_0_1px_1px_rgb(0_0_0_/_60%)]">
                    Your place to organise <br /> what you want to see most.
                </h1>
                {authenticated && (
                    <div className="mt-2">
                        <CreateListModal open={open} setOpen={setOpen} />
                    </div>
                )}
            </div>
            <Image
                width={0}
                height={0}
                sizes="100vw"
                src={`https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg`}
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
