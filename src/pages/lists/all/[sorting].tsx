import Layout, { Container } from "@/components/common/Layout/Layout";
import InfiniteListSection from "@/components/common/Pages/Lists/AllLists/InfiniteListSection";
import Button from "@/components/ui/Button/Button";
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
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const sortToKeyMap = {
    Top: "listLikes",
    Newest: "createdAt",
};

const AllListsBySortingPage: NextPage<PageProps> = ({ sorting }) => {
    const router = useRouter();
    const [selectedDurationSort, setSelectedDurationSort] =
        useState<string>("30 days");
    const [sortBySelection, setSortBySelection] = useState<string>(
        _.upperFirst(String(router.query.sorting))
    );
    const {
        data: lists,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
    } = api.list.lists.useInfiniteQuery(
        {
            limit: 10,
            orderBy: sortToKeyMap[sortBySelection as keyof typeof sortToKeyMap],
            dateSortBy: getDatesToSortBy(selectedDurationSort),
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    console.log(router.query.duration);

    useEffect(() => {
        getDatesToSortBy(selectedDurationSort);
    }, [selectedDurationSort]);

    useEffect(() => {
        void router.push(
            {
                pathname: "/lists/all/[sorting]",
                query: {
                    sorting: _.lowerCase(sortBySelection),
                },
            },
            undefined,
            { shallow: true }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBySelection, selectedDurationSort]);

    return (
        <>
            <Head>
                <title>{`All lists • Crumble`}</title>
            </Head>
            <Layout>
                <Container>
                    <Header
                        sorting={sorting}
                        selectedDurationSort={selectedDurationSort}
                        setSelectedDurationSort={setSelectedDurationSort}
                        setSortBySelection={setSortBySelection}
                        sortBySelection={sortBySelection}
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
    sortBySelection: string;
    setSortBySelection: Dispatch<SetStateAction<string>>;
}

const Header = ({
    selectedDurationSort,
    setSelectedDurationSort,
    sortBySelection,
    setSortBySelection,
}: HeaderProps) => {
    return (
        <div className="flex">
            <div className="flex w-[100%]">
                <h3>All lists</h3>
            </div>
            <div className="float-right flex space-x-2">
                {sortBySelection === "Top" && (
                    <Select
                        value={selectedDurationSort}
                        setValue={setSelectedDurationSort}
                    >
                        <Select.Item value="1 week">1 week</Select.Item>
                        <Select.Item value="30 days">30 days</Select.Item>
                        <Select.Item value="6 months">6 months</Select.Item>
                        <Select.Item value="1 year">1 year</Select.Item>
                        <Select.Item value="All time">All time</Select.Item>
                    </Select>
                )}
                <Select value={sortBySelection} setValue={setSortBySelection}>
                    <Select.Item value="Newest">Newest</Select.Item>
                    <Select.Item value="Top">Top</Select.Item>
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
