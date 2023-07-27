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
                        select: { reviewLikes: true },
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
            const review = await ctx.prisma.review.findFirst({
                where: {
                    id,
                },
                include: {
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
            return review;
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
    toggleLike: protectedProcedure
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
});
