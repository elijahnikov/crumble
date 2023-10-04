import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
    //
    //  get notifications for user
    //
    getNotifications: protectedProcedure
        .input(
            z.object({
                limit: z.number().optional(),
                cursor: z
                    .object({
                        id: z.string(),
                        createdAt: z.date(),
                    })
                    .optional(),
            })
        )
        .query(async ({ ctx, input: { limit = 10, cursor } }) => {
            const currentUserId = ctx.session.user.id;
            const data = await ctx.prisma.notification.findMany({
                take: 10,
                where: {
                    notifiedId: currentUserId,
                },
                orderBy: { createdAt: "desc" },
                cursor: cursor ? { createdAt_id: cursor } : undefined,
                select: {
                    createdAt: true,
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
                notifications: data.map((notification) => {
                    return notification;
                }),
                nextCursor,
            };
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
