import { z } from "zod";
import { createMovieSchema } from "../schemas/movie";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";

export const movieRouter = createTRPCRouter({
    //
    // Add film
    //
    createFilm: protectedProcedure
        .input(createMovieSchema)
        .mutation(async ({ ctx, input }) => {
            const movie = await ctx.prisma.movie.findFirst({
                where: {
                    movieId: input.movieId,
                },
            });
            if (movie) {
                const currentNumberOfRatings = movie.numberOfRatings;
                const currentAverageRating = movie.rating;

                const userRating = input.rating;

                const newNumberOfRatings = currentNumberOfRatings + 1;
                const newAverageRating =
                    (currentAverageRating * currentNumberOfRatings +
                        userRating) /
                    newNumberOfRatings;

                await prisma.movie.update({
                    where: {
                        id: movie.id,
                    },
                    data: {
                        watchedCount: {
                            increment: 1,
                        },
                        rating: newAverageRating ?? undefined,
                        numberOfRatings: newNumberOfRatings ?? undefined,
                    },
                });
                return;
            }

            const { fromReview, ...remainingInput } = input;

            await ctx.prisma.movie.create({
                data: {
                    ...remainingInput,
                    numberOfRatings: input.rating ? 1 : 0,
                    watchedCount: fromReview ? 1 : 0,
                },
            });
        }),
    //
    // Get film by id
    //
    film: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input: { id } }) => {
            const data = await ctx.prisma.movie.findFirst({
                where: {
                    movieId: id,
                },
            });

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Film with id: ${id} not found`,
                });
            }

            return {
                data,
            };
        }),
});
