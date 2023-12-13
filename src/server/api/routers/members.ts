import { membersSchema } from "../schemas/members";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const membersRouter = createTRPCRouter({
    //
    // Get all members
    //
    members: publicProcedure
        .input(membersSchema)
        .query(
            async ({
                ctx,
                input: {
                    limit = 10,
                    cursor,
                    dateSortBy,
                    orderBy,
                    orderDirection,
                },
            }) => {
                const data = await ctx.prisma.user.findMany({
                    take: limit + 1,
                    orderBy:
                        // if order by is supplied and its not createdAt orderBy key
                        orderBy && orderBy !== "createdAt"
                            ? {
                                  [orderBy]: {
                                      _count: orderDirection,
                                  },
                              }
                            : [{ id: "desc" }],
                    cursor: cursor ? { createdAt_id: cursor } : undefined,
                    where:
                        dateSortBy && orderBy !== "createdAt"
                            ? {
                                  createdAt: {
                                      lte: new Date(),
                                      gte: dateSortBy,
                                  },
                              }
                            : {},
                    select: {
                        _count: {
                            select: {
                                reviews: true,
                                lists: true,
                                followers: true,
                                following: true,
                                watched: true,
                            },
                        },
                        id: true,
                        createdAt: true,
                        name: true,
                        displayName: true,
                        image: true,
                        reviews: {
                            take: 3,
                            select: {
                                movieId: true,
                                moviePoster: true,
                                movieTitle: true,
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
                    members: data,
                    nextCursor,
                };
            }
        ),
});
