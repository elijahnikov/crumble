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
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.subscription.findMany({
                where: {
                    follower: {
                        name: input.username,
                    },
                },
                select: {
                    following: {
                        select: {
                            name: true,
                            image: true,
                            displayName: true,
                            id: true,
                        },
                    },
                },
            });
        }),
    //
    // Get list of following for a specific user
    //
    getFollowingForUser: publicProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.subscription.findMany({
                where: {
                    following: {
                        name: input.username,
                    },
                },
                select: {
                    follower: {
                        select: {
                            name: true,
                            image: true,
                            displayName: true,
                            id: true,
                        },
                    },
                },
            });
        }),
});
