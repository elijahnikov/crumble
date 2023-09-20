import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
    //
    // Create subscription
    //
    toggleSubscription: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const me = ctx.session.user.id;
            const followCheck = await ctx.prisma.subscription.findFirst({
                where: {
                    followerId: me,
                    followingId: input.id,
                },
            });
            if (!followCheck) {
                await ctx.prisma.subscription.create({
                    data: {
                        followerId: me,
                        followingId: input.id,
                    },
                });
            } else {
                await ctx.prisma.subscription.deleteMany({
                    where: {
                        followerId: me,
                        followingId: input.id,
                    },
                });
            }
        }),
    //
    // Get list of followers for a specific user
    //
    getFollowersForUser: publicProcedure
        .input(
            z.object({
                username: z.string(),
                limit: z.number().optional(),
                cursor: z
                    .object({
                        followerId: z.string(),
                        followingId: z.string(),
                    })
                    .optional(),
            })
        )
        .query(async ({ ctx, input: { limit = 3, username, cursor } }) => {
            const currentUserId = ctx.session?.user.id;
            const data = await ctx.prisma.subscription.findMany({
                take: limit + 1,
                where: {
                    following: {
                        name: username,
                    },
                },
                cursor: cursor ? { followerId_followingId: cursor } : undefined,
                orderBy: [{ followerId: "asc" }],
                include: {
                    follower: {
                        select: {
                            name: true,
                            image: true,
                            displayName: true,
                            id: true,
                            followers:
                                currentUserId === null
                                    ? false
                                    : { where: { followerId: currentUserId } },
                        },
                    },
                },
            });
            let nextCursor: typeof cursor | undefined;
            if (data.length > limit) {
                const nextItem = data.pop();
                if (nextItem != null) {
                    nextCursor = {
                        followerId: nextItem.followerId,
                        followingId: nextItem.followingId,
                    };
                }
            }
            return {
                followers: data.map((follower) => {
                    return {
                        name: follower.follower.name,
                        displayName: follower.follower.displayName,
                        image: follower.follower.image,
                        userId: follower.follower.id,
                        amIFollowing:
                            follower.follower.followers.length > 0 &&
                            currentUserId,
                    };
                }),
                nextCursor,
            };
        }),
});
