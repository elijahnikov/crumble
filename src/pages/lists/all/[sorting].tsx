import Layout, { Container } from "@/components/common/Layout/Layout";
import InfiniteListSection from "@/components/common/Pages/Lists/AllLists/InfiniteListSection";
import { Select } from "@/components/ui/Select/Select";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";
import _ from "lodash";
import type {
    InferGetStaticPropsType,
    GetStaticPropsContext,
    NextPage,
    GetStaticPaths,
} from "next";
import Head from "next/head";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const sortToKeyMap = {
    popular: "listLikes",
};

const AllListsBySortingPage: NextPage<PageProps> = ({ sorting }) => {
    const [selectedDurationSort, setSelectedDurationSort] =
        useState<string>("30 days");
    console.log(sortToKeyMap[sorting as keyof typeof sortToKeyMap]);
    const {
        data: lists,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
    } = api.list.lists.useInfiniteQuery(
        {
            limit: 10,
            orderBy: sortToKeyMap[sorting as keyof typeof sortToKeyMap],
            dateSortBy: getDatesToSortBy(selectedDurationSort),
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    useEffect(() => {
        getDatesToSortBy(selectedDurationSort);
    }, [selectedDurationSort]);

    return (
        <>
            <Head>
                <title>
                    {`All lists - ${_.upperFirst(sorting)} • Crumble`}
                </title>
            </Head>
            <Layout>
                <Container>
                    <Header
                        sorting={sorting}
                        selectedDurationSort={selectedDurationSort}
                        setSelectedDurationSort={setSelectedDurationSort}
                    />
                    <InfiniteListSection
                        isError={isError}
                        isLoading={isLoading}
                        hasMore={hasNextPage}
                        lists={lists?.pages.flatMap((page) => page.lists)}
                        fetchNewLists={fetchNextPage}
                        toggleLike={() => null}
                    />
                </Container>
            </Layout>
        </>
    );
};

interface HeaderProps {
    sorting: string;
    selectedDurationSort: string;
    setSelectedDurationSort: Dispatch<SetStateAction<string>>;
}

const Header = ({
    sorting,
    selectedDurationSort,
    setSelectedDurationSort,
}: HeaderProps) => {
    return (
        <div className="flex">
            <h3 className="w-[100%]">{_.upperFirst(sorting)} lists</h3>
            <div className="float-right">
                <Select
                    value={selectedDurationSort}
                    setValue={setSelectedDurationSort}
                    placeholder="Sort by"
                >
                    <Select.Item value="1 week">1 week</Select.Item>
                    <Select.Item value="30 days">30 days</Select.Item>
                    <Select.Item value="6 months">6 months</Select.Item>
                    <Select.Item value="1 year">1 year</Select.Item>
                    <Select.Item value="All time">All time</Select.Item>
                </Select>
            </div>
        </div>
    );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const helpers = await generateSSGHelper();

    const sorting = context.params?.sorting;

    if (typeof sorting !== "string") throw new Error("No slug");

    await helpers.list.lists.prefetchInfinite({ orderBy: sorting });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            sorting,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default AllListsBySortingPage;
