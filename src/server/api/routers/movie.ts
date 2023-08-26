import { z } from "zod";
import { movieSchema } from "../schemas/movie";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";

export const movieRouter = createTRPCRouter({
    //
    // Add film
    //
    createFilm: protectedProcedure
        .input(movieSchema)
        .mutation(async ({ ctx, input }) => {
            const film = await ctx.prisma.movie.findFirst({
                where: {
                    movieId: input.movieId,
                },
            });

            if (film) {
                await prisma.movie.update({
                    where: {
                        id: film.id,
                    },
                    data: {
                        watchedCount: {
                            increment: 1,
                        },
                    },
                });
            }

            await ctx.prisma.movie.create({
                data: {
                    ...input,
                    watchedCount: input.fromReview ? 1 : 0,
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
