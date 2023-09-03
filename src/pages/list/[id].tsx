import CommentSection from "@/components/common/CommentSection/CommentSection";
import Layout from "@/components/common/Layout/Layout";
import SingleListView from "@/components/common/Pages/Lists/SingleListPage/SingleListView";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import type {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
    NextPage,
} from "next";
import Head from "next/head";
import toast from "react-hot-toast";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SingleListPage: NextPage<PageProps> = ({ id }) => {
    const trpcUtils = api.useContext();

    const { data, isLoading } = api.list.list.useQuery({ id });
    const {
        data: listComments,
        isLoading: isListCommentsLoading,
        isError: isListCommentsError,
        hasNextPage,
        fetchNextPage,
    } = api.list.infiniteCommentFeed.useInfiniteQuery(
        {
            limit: 10,
            id: data!.list.id!,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const { mutate: createListComment } =
        api.list.createListComment.useMutation({
            onSuccess: async () => {
                await trpcUtils.list.infiniteCommentFeed.invalidate();
                await trpcUtils.list.list.invalidate();
            },
        });
    const { mutate: deleteListComment } =
        api.list.deleteListComment.useMutation({
            onSuccess: async () => {
                toast.success(`Deleted your comment.`, {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
                await trpcUtils.list.infiniteCommentFeed.invalidate();
                await trpcUtils.list.list.invalidate();
            },
        });
    const toggleLike = api.list.toggleListCommentLike.useMutation({
        onSuccess: async () => {
            await trpcUtils.list.infiniteCommentFeed.invalidate();
        },
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>404</div>;

    return (
        <>
            <Head>
                <title>{`${data.list.title} - List by @${data.list.user.name} • Crumble`}</title>
            </Head>
            <Layout>
                <SingleListView list={data} />
                <CommentSection
                    commentCount={data.list.commentCount}
                    linkedToId={data.list.id}
                    comments={listComments?.pages.flatMap(
                        (page) => page.listComments
                    )}
                    isError={isListCommentsError}
                    isLoading={isListCommentsLoading}
                    hasMore={hasNextPage}
                    fetchNewComments={fetchNextPage}
                    createNewComment={createListComment}
                    deleteComment={deleteListComment}
                    toggleLike={toggleLike.mutate}
                />
            </Layout>
        </>
    );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const helpers = await generateSSGHelper();

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("No slug");

    await helpers.list.list.prefetch({ id });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default SingleListPage;
