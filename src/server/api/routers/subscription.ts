import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
