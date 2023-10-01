import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
    //
    //
    //
    getNotifications: protectedProcedure.query(async ({ ctx }) => {
        const currentUserId = ctx.session.user.id;
        const notifications = await ctx.prisma.notification.findMany({
            where: {
                notifiedId: currentUserId,
            },
            select: {
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
});
