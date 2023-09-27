import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
    createListSchema,
    listsSchema,
    updateListSchema,
} from "../schemas/list";
import { createNewActivity } from "@/server/helpers/createActivity";

export const listRouter = createTRPCRouter({
    //
    // Get all lists
    //
    lists: publicProcedure
        .input(listsSchema)
        .query(
            async ({
                ctx,
                input: {
                    limit = 10,
                    cursor,
                    orderBy,
                    dateSortBy,
                    orderDirection = "desc",
                    username,
                },
            }) => {
                const currentUserId = ctx.session?.user.id;
                const data = await ctx.prisma.list.findMany({
                    take: limit + 1,
                    orderBy:
                        // if order by is supplied and its not createdAt orderBy key
                        orderBy && orderBy !== "createdAt"
                            ? {
                                  [orderBy]: {
                                      _count: orderDirection,
                                  },
                              }
                            : [{ createdAt: orderDirection }, { id: "desc" }],
                    cursor: cursor ? { createdAt_id: cursor } : undefined,
                    where:
                        // only apply date sort by if not sorting by recent
                        dateSortBy && orderBy !== "createdAt"
                            ? {
                                  createdAt: {
                                      lte: new Date(),
                                      gte: dateSortBy,
                                  },
                              }
                            : username
                            ? {
                                  user: {
                                      name: username,
                                  },
                              }
                            : {},
                    include: {
                        _count: {
                            select: {
                                listLikes: true,
                                listComments: true,
                                listEntries: true,
                            },
                        },
                        listEntries: {
                            select: {
                                id: true,
                                listId: true,
                                movieId: true,
                                movie: {
                                    select: {
                                        movieId: true,
                                        title: true,
                                        poster: true,
                                    },
                                },
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
                            likedByMe:
                                list.listLikes.length > 0 &&
                                ctx.session?.user.id,
                        };
                    }),
                    nextCursor,
                };
            }
        ),
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
                                    releaseDate: true,
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
                    likedByMe:
                        data.listLikes.length > 0 && ctx.session?.user.id,
                },
            };
        }),
    //
    // Like/Unlike list
    //
    toggleListLike: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input: { id }, ctx }) => {
            const data = { listId: id, userId: ctx.session.user.id };

            const existingLike = await ctx.prisma.listLike.findUnique({
                where: { userId_listId: data },
            });
            if (!existingLike) {
                await ctx.prisma.listLike.create({ data });
                return { addedLike: true };
            }
            {
                await ctx.prisma.listLike.delete({
                    where: { userId_listId: data },
                });
                return { addedLike: false };
            }
        }),
    //
    // Create list
    //
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

            await createNewActivity({
                currentUserId: userId,
                action: `Created a new list containing ${list.numberOfFilms} movies.`,
                activity: "listId",
                id: list.id,
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
    //
    // Delete movie list
    //
    deleteList: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.list.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    //
    //  Update movie list
    //
    updateList: protectedProcedure
        .input(updateListSchema)
        .mutation(async ({ ctx, input }) => {
            const listId = input.id;
            await ctx.prisma.list.update({
                where: {
                    id: listId,
                },
                data: {
                    title: input.title,
                    description: input.description,
                },
            });
        }),
    //
    // Add movie to list
    //
    addEntryToList: protectedProcedure
        .input(z.object({ listId: z.string(), movieId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { listId, movieId } = input;
            const currentUserId = ctx.session.user.id;
            const listEntry = await ctx.prisma.listEntry.findFirst({
                where: {
                    listId,
                    movieId: movieId,
                },
            });

            if (listEntry) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Movie is already present in list",
                });
            }

            const newListEntry = await ctx.prisma.listEntry.create({
                data: {
                    listId,
                    movieId,
                },
                include: {
                    list: true,
                    movie: true,
                },
            });
            await createNewActivity({
                currentUserId,
                action: `Added {1} to their list titled ${newListEntry.list.title}`,
                activity: "listEntryId",
                id: newListEntry.id,
            });
            return {
                entryCreated: true,
            };
        }),
    //
    // Delete movie from list
    //
    removeEntryFromList: protectedProcedure
        .input(z.object({ listId: z.string(), entryIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            const entries = input.entryIds.map((entryId) => {
                return {
                    listId: input.listId,
                    id: entryId,
                };
            });
            // const { listId, entryId } = input;
            const list = await ctx.prisma.list.findFirst({
                where: {
                    id: input.listId,
                },
            });

            if (!list) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "List or list entry do not exist",
                });
            }

            const deleted = await ctx.prisma.listEntry.deleteMany({
                where: {
                    OR: entries,
                },
            });

            return {
                entryDeleted: deleted,
            };
        }),
    // -----------------------------------------------------------------------------//
    // -------------------------------- Comments -----------------------------------//
    // -----------------------------------------------------------------------------//
    //
    // Infinite feed of list comments
    //
    infiniteCommentFeed: publicProcedure
        .input(
            z.object({
                id: z.string(),
                limit: z.number().optional(),
                cursor: z
                    .object({ id: z.string(), createdAt: z.date() })
                    .optional(),
            })
        )
        .query(async ({ input: { limit = 10, cursor, id }, ctx }) => {
            const currentUserId = ctx.session?.user.id;

            const listComments = await ctx.prisma.listComment.findMany({
                where: {
                    listId: id,
                },
                take: limit + 1,
                cursor: cursor ? { createdAt_id: cursor } : undefined,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                select: {
                    id: true,
                    text: true,
                    listId: true,
                    user: {
                        select: {
                            name: true,
                            displayName: true,
                            id: true,
                            image: true,
                        },
                    },
                    createdAt: true,
                    _count: {
                        select: { listCommentLikes: true },
                    },
                    listCommentLikes:
                        currentUserId === null
                            ? false
                            : { where: { userId: currentUserId } },
                },
            });
            let nextCursor: typeof cursor | undefined;
            if (listComments.length > limit) {
                const nextItem = listComments.pop();
                if (nextItem != null) {
                    nextCursor = {
                        id: nextItem.id,
                        createdAt: nextItem.createdAt,
                    };
                }
            }
            return {
                listComments: listComments.map((comment) => {
                    return {
                        id: comment.id,
                        text: comment.text,
                        linkedToId: comment.listId,
                        user: comment.user,
                        likeCount: comment._count.listCommentLikes,
                        likedByMe:
                            comment.listCommentLikes?.length > 0 &&
                            ctx.session?.user.id,
                        createdAt: comment.createdAt,
                    };
                }),
                nextCursor,
            };
        }),
    //
    // Create list comment
    //
    createListComment: protectedProcedure
        .input(z.object({ linkedToId: z.string(), text: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;
            const listComment = await ctx.prisma.listComment.create({
                data: {
                    text: input.text,
                    listId: input.linkedToId,
                    userId: currentUserId,
                },
            });
            return listComment;
        }),
    //
    // Delete list comment
    //
    deleteListComment: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.listComment.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    //
    // Toggle like for list comment
    //
    toggleListCommentLike: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input: { id }, ctx }) => {
            const data = { listCommentId: id, userId: ctx.session.user.id };

            const existingLike = await ctx.prisma.listCommentLike.findUnique({
                where: {
                    userId_listCommentId: data,
                },
            });
            if (!existingLike) {
                await ctx.prisma.listCommentLike.create({ data });
                return { addedLike: true };
            } else {
                await ctx.prisma.listCommentLike.delete({
                    where: {
                        userId_listCommentId: data,
                    },
                });
                return { addedLike: false };
            }
        }),
    // -----------------------------------------------------------------------------//
    // ------------------------------------ Tags -----------------------------------//
    // -----------------------------------------------------------------------------//
    //
    // Get tags
    //
    tags: publicProcedure.query(async ({ ctx }) => {
        const tags = await ctx.prisma.listTags.findMany({
            take: 20,
            orderBy: [{ count: "desc" }, { createdAt: "desc" }],
        });
        return tags;
    }),
    //
    // Create tag
    //
    createTags: protectedProcedure
        .input(z.object({ tags: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            const checkTags = await ctx.prisma.listTags.findMany({
                where: {
                    text: {
                        in: input.tags,
                    },
                },
            });

            const existingsTags = checkTags.map((tag) => tag.text);
            const missingTags = input.tags.filter(
                (text) => !existingsTags.includes(text)
            );

            if (existingsTags.length > 0) {
                await ctx.prisma.listTags.updateMany({
                    where: {
                        text: {
                            in: existingsTags,
                        },
                    },
                    data: {
                        count: {
                            increment: 1,
                        },
                    },
                });
            }
            if (missingTags.length > 0) {
                const missingTagsObj = missingTags.map((tag) => {
                    return { text: tag };
                });

                await ctx.prisma.listTags.createMany({
                    data: missingTagsObj,
                });
            }
        }),
});
