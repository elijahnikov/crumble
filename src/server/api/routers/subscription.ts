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
                await ctx.prisma.notification.create({
                    data: {
                        notifiedId: input.id,
                        notifierId: me,
                        followerId: me,
                        followingId: input.id,
                        type: "follow",
                    },
                });
            } else {
                await ctx.prisma.subscription.delete({
                    where: {
                        followerId_followingId: {
                            followerId: me,
                            followingId: input.id,
                        },
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
        .query(async ({ ctx, input: { limit = 10, username, cursor } }) => {
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
    //
    // Get list of following for specific user
    //
    getFollowingForUser: publicProcedure
        .input(
            z.object({
                username: z.string(),
                limit: z.number().optional(),
                cursor: z
                    .object({
                        followingId: z.string(),
                        followerId: z.string(),
                    })
                    .optional(),
            })
        )
        .query(async ({ ctx, input: { limit = 10, username, cursor } }) => {
            const currentUserId = ctx.session?.user.id;
            const data = await ctx.prisma.subscription.findMany({
                take: limit + 1,
                where: {
                    follower: {
                        name: username,
                    },
                },
                cursor: cursor ? { followingId_followerId: cursor } : undefined,
                orderBy: [{ followingId: "asc" }],
                include: {
                    following: {
                        select: {
                            name: true,
                            image: true,
                            displayName: true,
                            id: true,
                            following:
                                currentUserId === null
                                    ? false
                                    : { where: { followingId: currentUserId } },
                        },
                    },
                },
            });
            let nextCursor: typeof cursor | undefined;
            if (data.length > limit) {
                const nextItem = data.pop();
                if (nextItem != null) {
                    nextCursor = {
                        followingId: nextItem.followingId,
                        followerId: nextItem.followerId,
                    };
                }
            }
            return {
                following: data.map((following) => {
                    return {
                        name: following.following.name,
                        displayName: following.following.displayName,
                        image: following.following.image,
                        userId: following.following.id,
                        amIFollowing:
                            following.following.following.length > 0 &&
                            currentUserId,
                    };
                }),
                nextCursor,
            };
        }),
});
