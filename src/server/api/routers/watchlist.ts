import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createNewActivity } from "@/server/helpers/createActivity";

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

export const watchlistRouter = createTRPCRouter({
    //
    // Get watchlist for user
    //
    watchlist: publicProcedure
        .input(
            z.object({
                username: z.string(),
                limit: z.number().optional(),
                cursor: z
                    .object({ id: z.string(), createdAt: z.date() })
                    .optional(),
                sortBy: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { limit = 20, ...input } }) => {
            const { username, cursor, sortBy } = input;
            const data = await ctx.prisma.watchlist.findMany({
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
                    movie: true,
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
                watchlist: data,
                nextCursor,
            };
        }),
    //
    // Add new movie entry to watchlist
    //
    addToWatchlist: protectedProcedure
        .input(z.object({ movieId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;
            const watchlist = await ctx.prisma.watchlist.create({
                data: {
                    movieId: input.movieId,
                    userId: currentUserId,
                },
            });
            await createNewActivity({
                currentUserId: currentUserId,
                idMap: [{ watchlistId: watchlist.id }],
            });
            return watchlist;
        }),
});
