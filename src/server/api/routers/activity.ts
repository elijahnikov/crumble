import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const activityRouter = createTRPCRouter({
    //
    // Get paginated list of activities for specific user
    //
    getActivityForUser: publicProcedure
        .input(
            z.object({
                username: z.string(),
                limit: z.number().optional(),
                cursor: z
                    .object({ id: z.string(), createdAt: z.date() })
                    .optional(),
            })
        )
        .query(async ({ ctx, input: { limit = 10, cursor, username } }) => {
            const data = await ctx.prisma.activity.findMany({
                take: limit + 1,
                where: {
                    user: {
                        name: username,
                    },
                },
                cursor: cursor ? { createdAt_id: cursor } : undefined,
                select: {
                    favouriteMovie: true,
                    createdAt: true,
                    id: true,
                    listEntry: true,
                    list: true,
                    review: true,
                    watched: true,
                    user: {
                        select: {
                            name: true,
                            displayName: true,
                            id: true,
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
                activities: data.map((activity) => {
                    const filteredActivity = Object.fromEntries(
                        Object.entries(activity).filter(
                            ([_, value]) => value !== null
                        )
                    );
                    return {
                        ...filteredActivity,
                    };
                }),
                nextCursor,
            };
        }),
});
