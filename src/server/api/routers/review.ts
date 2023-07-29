import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { newReviewSchema, reviewsSchema } from "../schemas/review";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "30 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export const reviewRouter = createTRPCRouter({
    // -----------------------------------------------------------------------------//
    // -------------------------------- Reviews ------------------------------------//
    // -----------------------------------------------------------------------------//
    //
    // Get all reviews
    //
    reviews: publicProcedure
        .input(reviewsSchema)
        .query(async ({ ctx, input: { limit = 10, cursor } }) => {
            const currentUserId = ctx.session?.user.id;
            const data = await ctx.prisma.review.findMany({
                take: limit + 1,
                cursor: cursor ? { createdAt_id: cursor } : undefined,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                include: {
                    _count: {
                        select: { reviewLikes: true, reviewComments: true },
                    },
                    reviewLikes:
                        currentUserId === null
                            ? false
                            : { where: { userId: currentUserId } },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            image: true,
                        },
                    },
                },
            });
            let nextCursor: typeof cursor | undefined;
            if (data.length > limit) {
                const nextItem = data.pop();
                if (nextItem != null) {
                    nextCursor = {
                        id: nextItem.id,
                        createdAt: nextItem.createdAt,
                    };
                }
            }
            return {
                reviews: data.map((review) => {
                    return {
                        ...review,
                        likeCount: review._count.reviewLikes,
                        commentCount: review._count.reviewComments,
                        user: { ...review.user },
                        likedByMe: review.reviewLikes.length > 0,
                    };
                }),
                nextCursor,
            };
        }),
    //
    // Get specific review by id
    //
    review: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input: { id } }) => {
            const currentUserId = ctx.session?.user.id;

            const data = await ctx.prisma.review.findFirst({
                where: {
                    id,
                },
                include: {
                    _count: {
                        select: { reviewLikes: true, reviewComments: true },
                    },
                    reviewLikes:
                        currentUserId === null
                            ? false
                            : { where: { userId: currentUserId } },
                    reviewComments: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            image: true,
                        },
                    },
                },
            });
            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Review with id: ${id} not found`,
                });
            }
            return {
                review: {
                    ...data,
                    likeCount: data?._count.reviewLikes,
                    commentCount: data._count.reviewComments,
                    user: { ...data.user },
                    likedByMe: data.reviewLikes.length > 0,
                    comments: { ...data.reviewComments },
                },
            };
        }),
    //
    // Create review
    //
    createReview: protectedProcedure
        .input(newReviewSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const { success } = await ratelimit.limit(userId);

            if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            if (input.tags) {
                const tags = input.tags.split(",");
                tags.forEach((tag) => {
                    async () => {
                        const tagCheck = await ctx.prisma.reviewTag.findFirst({
                            where: {
                                text: tag,
                            },
                        });
                        if (tagCheck) {
                            await ctx.prisma.reviewTag.update({
                                where: { id: tagCheck.id },
                                data: { count: { increment: 1 } },
                            });
                        } else {
                            await ctx.prisma.reviewTag.create({
                                data: {
                                    text: tag,
                                    count: 1,
                                },
                            });
                        }
                    };
                });
            }

            const review = await ctx.prisma.review.create({
                data: {
                    userId,
                    ...input,
                },
            });
            return review;
        }),
    //
    // Update review
    //
    updateReview: protectedProcedure
        .input(z.object({ reviewId: z.string(), text: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const review = ctx.prisma.review.update({
                where: {
                    id: input.reviewId,
                },
                data: {
                    text: input.text,
                },
            });
            return review;
        }),
    //
    // Delete review
    //
    deleteReview: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.review.delete({
                where: {
                    id: input.id,
                },
            });
            return true;
        }),
    //
    // Like/Unlike review
    //
    toggleReviewLike: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input: { id }, ctx }) => {
            const data = { reviewId: id, userId: ctx.session.user.id };

            const existingLike = await ctx.prisma.reviewLike.findUnique({
                where: { userId_reviewId: data },
            });
            if (!existingLike) {
                await ctx.prisma.reviewLike.create({ data });
                return { addedLike: true };
            }
            {
                await ctx.prisma.reviewLike.delete({
                    where: { userId_reviewId: data },
                });
                return { addedLike: false };
            }
        }),
    // -----------------------------------------------------------------------------//
    // -------------------------------- Comments -----------------------------------//
    // -----------------------------------------------------------------------------//
    //
    // Create review comment
    //
    createReviewComment: protectedProcedure
        .input(
            z.object({
                reviewId: z.string(),
                text: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;
            const reviewComment = await ctx.prisma.reviewComment.create({
                data: { ...input, userId: currentUserId },
            });
            return reviewComment;
        }),
    //
    // Delete review comment
    //
    deleteReviewComment: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.reviewComment.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    //
    // Update review comment
    //
    updateReviewComment: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                text: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedComment = await ctx.prisma.reviewComment.update({
                where: {
                    id: input.id,
                },
                data: {
                    text: input.text,
                },
            });
            if (!updatedComment) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not update review comment.",
                });
            }
            return updatedComment;
        }),
    //
    // Toggle like for review comment
    //
    toggleReviewCommentLike: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input: { id }, ctx }) => {
            const data = { reviewCommentId: id, userId: ctx.session.user.id };

            const existingLike = await ctx.prisma.reviewCommentLike.findUnique({
                where: { userId_reviewCommentId: data },
            });
            if (!existingLike) {
                await ctx.prisma.reviewCommentLike.create({ data });
                return { addedLike: true };
            } else {
                await ctx.prisma.reviewCommentLike.delete({
                    where: {
                        userId_reviewCommentId: data,
                    },
                });
                return { addedLike: false };
            }
        }),
});
