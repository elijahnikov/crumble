import Layout from "@/components/common/Layout/Layout";
import CommentSection from "@/components/common/CommentSection/CommentSection";
import SingleReviewView from "@/components/common/Pages/Reviews/SingleReviewPage/SingleReviewView";
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

const SingleReviewPage: NextPage<PageProps> = ({ id }) => {
    const trpcUtils = api.useContext();

    const { data, isLoading } = api.review.review.useQuery({ id });
    const {
        data: reviewComments,
        isLoading: isReviewCommentsLoading,
        isError: isReviewCommentsError,
        hasNextPage,
        fetchNextPage,
    } = api.review.infiniteCommentFeed.useInfiniteQuery(
        {
            limit: 10,
            id: data!.review.id,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const { mutate: createReviewComment } =
        api.review.createReviewComment.useMutation({
            onSuccess: async () => {
                await trpcUtils.review.infiniteCommentFeed.invalidate();
            },
        });
    const { mutate: deleteReviewComment } =
        api.review.deleteReviewComment.useMutation({
            onSuccess: async () => {
                toast.success(`Deleted your comment.`, {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
                await trpcUtils.review.infiniteCommentFeed.invalidate();
            },
        });
    const toggleLike = api.review.toggleReviewCommentLike.useMutation({
        onSuccess: async () => {
            await trpcUtils.review.infiniteCommentFeed.invalidate();
        },
    });
    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>404</div>;

    return (
        <>
            <Head>
                <title>{`@${data.review.user.name}'s ${
                    data.review.movieTitle
                } (${data.review.movieReleaseYear.slice(
                    0,
                    4
                )}) Review • Crumble`}</title>
            </Head>
            <Layout>
                <SingleReviewView review={data} />
                <CommentSection
                    commentCount={data.review.commentCount}
                    linkedToId={data.review.id}
                    comments={reviewComments?.pages.flatMap(
                        (page) => page.reviewComments
                    )}
                    isError={isReviewCommentsError}
                    isLoading={isReviewCommentsLoading}
                    hasMore={hasNextPage}
                    fetchNewComments={fetchNextPage}
                    createNewComment={createReviewComment}
                    deleteComment={deleteReviewComment}
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

    await helpers.review.review.prefetch({ id });

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

export default SingleReviewPage;
