import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const activityRouter = createTRPCRouter({
    //
    // Get paginated list of activities for specific user
    //
    getActivityForUser: publicProcedure
        .input(
            z.object({
                specificActivity: z
                    .array(
                        z.enum([
                            "list",
                            "watched",
                            "listEntry",
                            "review",
                            "favouriteMovie",
                        ])
                    )
                    .optional(),
                username: z.string(),
                limit: z.number().optional(),
                cursor: z
                    .object({ id: z.string(), createdAt: z.date() })
                    .optional(),
            })
        )
        .query(
            async ({
                ctx,
                input: { limit = 10, cursor, username, specificActivity },
            }) => {
                const where: Array<Record<string, { isNot: null }>> = [];
                specificActivity?.forEach((activity) => {
                    where.push({
                        [activity]: {
                            isNot: null,
                        },
                    });
                });
                const data = await ctx.prisma.activity.findMany({
                    take: limit + 1,
                    where: specificActivity
                        ? {
                              OR: where,
                              AND: [
                                  {
                                      user: {
                                          name: username,
                                      },
                                  },
                              ],
                          }
                        : {
                              user: {
                                  name: username,
                              },
                          },
                    orderBy: { createdAt: "desc" },
                    cursor: cursor ? { createdAt_id: cursor } : undefined,
                    select: {
                        favouriteMovie: {
                            include: {
                                movie: true,
                            },
                        },
                        createdAt: true,
                        id: true,
                        listEntry: {
                            include: {
                                list: {
                                    select: {
                                        title: true,
                                    },
                                },
                                movie: {
                                    select: {
                                        movieId: true,
                                        title: true,
                                    },
                                },
                            },
                        },
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
                        return activity;
                    }),
                    nextCursor,
                };
            }
        ),
});
