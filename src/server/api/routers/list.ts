import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { createListSchema, listsSchema } from "../schemas/list";

export const listRouter = createTRPCRouter({
    //
    // Get all lists
    //
    lists: publicProcedure
        .input(listsSchema)
        .query(async ({ ctx, input: { limit = 10, cursor } }) => {
            const currentUserId = ctx.session?.user.id;
            const data = await ctx.prisma.list.findMany({
                take: limit + 1,
                cursor: cursor ? { createdAt_id: cursor } : undefined,
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
                lists: data.map((list) => {
                    return {
                        ...list,
                        likeCount: list._count.listLikes,
                        commentCount: list._count.listComments,
                        user: { ...list.user },
                        likedByMe: list.listLikes.length > 0,
                    };
                }),
                nextCursor,
            };
        }),
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
    createList: protectedProcedure
        .input(createListSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const { movieIds, tags, ...destrInput } = input;

            if (tags) {
                const tagsArr = tags.split(",");
                tagsArr.forEach((tag) => {
                    async () => {
                        const tagCheck = await ctx.prisma.listTags.findFirst({
                            where: {
                                text: tag,
                            },
                        });
                        if (tagCheck) {
                            await ctx.prisma.listTags.update({
                                where: { id: tagCheck.id },
                                data: { count: { increment: 1 } },
                            });
                        } else {
                            await ctx.prisma.listTags.create({
                                data: {
                                    text: tag,
                                    count: 1,
                                },
                            });
                        }
                    };
                });
            }

            const list = await ctx.prisma.list.create({
                data: {
                    ...destrInput,
                    userId,
                    numberOfFilms: movieIds.length,
                },
            });
            const listId = list.id;

            await ctx.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    totalListsCreated: {
                        increment: 1,
                    },
                },
            });

            const listEntriesArr: { listId: string; movieId: number }[] = [];
            movieIds.forEach((movie) => {
                listEntriesArr.push({ listId, movieId: movie });
            });

            await ctx.prisma.listEntry.createMany({
                data: listEntriesArr,
            });

            return {
                list,
            };
        }),
});
