import { createNewActivity } from "@/server/helpers/createActivity";
import { createWatchedSchema, watchedSchema } from "../schemas/watched";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const sortByMapping: Record<string, object | []> = {
    movieName: {
        movie: {
            title: "asc",
        },
    },
    releaseDate: {
        movie: {
            releaseDate: "desc",
        },
    },
    averageRating: {
        movie: {
            rating: "desc",
        },
    },
    recentlyAdded: [{ createdAt: "desc" }, { id: "desc" }],
};

export const watchedRouter = createTRPCRouter({
    //
    // Get all watched for user
    //
    watched: publicProcedure
        .input(watchedSchema)
        .query(async ({ ctx, input: { limit = 20, ...input } }) => {
            const { username, cursor, sortBy } = input;

            const data = await ctx.prisma.watched.findMany({
                take: limit + 1,
                cursor: cursor ? { createdAt_id: cursor } : undefined,
                orderBy: sortBy
                    ? sortByMapping[sortBy]
                    : [{ createdAt: "desc" }, { id: "desc" }],
                where: {
                    user: {
                        name: username,
                    },
                },
                include: {
                    movie: {
                        select: {
                            releaseDate: true,
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
                watched: data,
                nextCursor,
            };
        }),
    //
    // Add to watched list
    //
    createWatched: protectedProcedure
        .input(createWatchedSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const { withReview, runtime, ...restInput } = input;

            const watched = await ctx.prisma.watched.upsert({
                where: {
                    userId_movieId: {
                        userId,
                        movieId: restInput.movieId,
                    },
                },
                update: {
                    createdAt: new Date(),
                },
                create: {
                    userId,
                    ...restInput,
                },
            });
            if (watched) {
                await ctx.prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        totalHoursWatched: {
                            increment: runtime,
                        },
                        totalMoviesWatched: {
                            increment: 1,
                        },
                    },
                });
            }
            if (!withReview)
                await createNewActivity({
                    currentUserId: userId,
                    idMap: [{ watchedId: watched.id }],
                });
            return watched;
        }),
});
