import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
    //
    //  get notifications for user
    //
    getNotifications: protectedProcedure.query(async ({ ctx }) => {
        const currentUserId = ctx.session.user.id;
        const notifications = await ctx.prisma.notification.findMany({
            take: 10,
            where: {
                notifiedId: currentUserId,
            },
            select: {
                id: true,
                follow: {
                    select: {
                        follower: {
                            select: {
                                name: true,
                                displayName: true,
                                image: true,
                                id: true,
                            },
                        },
                        following: {
                            select: {
                                name: true,
                                displayName: true,
                                image: true,
                                id: true,
                            },
                        },
                    },
                },
                review: {
                    select: {
                        id: true,
                        movieTitle: true,
                    },
                },
                reviewLike: true,
                notifier: {
                    select: {
                        name: true,
                        displayName: true,
                        image: true,
                        id: true,
                    },
                },
                read: true,
                type: true,
            },
        });
        return notifications;
    }),
    //
    // set notification as read
    //
    setRead: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.notification.update({
                where: {
                    id: input.id,
                },
                data: {
                    read: true,
                },
            });
        }),
    clearAll: protectedProcedure.mutation(async ({ ctx }) => {
        await ctx.prisma.notification.deleteMany({
            where: {
                notifiedId: ctx.session.user.id,
            },
        });
    }),
});
