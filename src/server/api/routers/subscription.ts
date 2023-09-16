import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
    //
    // Create subscription
    //
    createSubscription: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const me = ctx.session.user.id;
            // const followCheck = await ctx.prisma.subscription.findFirst({
            //     where: {
            //         followerId: me,
            //         followingId: input.id,
            //     },
            // });
            await ctx.prisma.subscription.create({
                data: {
                    followingId: me,
                    followerId: input.id,
                },
            });
        }),
});
