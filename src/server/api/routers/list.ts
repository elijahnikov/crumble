import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const listRouter = createTRPCRouter({
    //
    // Get list by id
    //
    list: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input: { id } }) => {
            const currentUserId = ctx.session?.user.id;

            const data = await ctx.prisma.list.findFirst({
                where: {
                    id,
                },
                include: {
                    _count: {
                        select: {
                            listLikes: true,
                            listComments: true,
                            listEntries: true,
                        },
                    },
                    listLikes:
                        currentUserId === null
                            ? false
                            : { where: { userId: currentUserId } },
                    listEntries: {
                        select: {
                            id: true,
                            movieId: true,
                            movie: {
                                select: {
                                    title: true,
                                    backdrop: true,
                                    movieId: true,
                                    poster: true,
                                    rating: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            image: true,
                        },
                    },
                },
            });
            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `List with id: ${id} not found`,
                });
            }
            return {
                list: {
                    ...data,
                    likeCount: data._count.listLikes,
                    commentCount: data._count.listComments,
                    user: { ...data.user },
                    likedByMe: data.listLikes.length > 0,
                },
            };
        }),
});
