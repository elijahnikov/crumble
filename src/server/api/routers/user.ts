import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { editUserDetailsSchema } from "../schemas/user";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";
import { createNewActivity } from "@/server/helpers/createActivity";
import { hash } from "argon2";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export const userRouter = createTRPCRouter({
    //
    // Get user by username
    //
    getUser: publicProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    name: input.username,
                },
                select: {
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        },
                    },
                    followers: {
                        where: {
                            following: {
                                name: input.username,
                            },
                        },
                    },
                    id: true,
                    name: true,
                    bio: true,
                    bioLink: true,
                    dev: true,
                    displayName: true,
                    header: true,
                    image: true,
                    totalListsCreated: true,
                    totalHoursWatched: true,
                    totalMoviesWatched: true,
                    verified: true,
                },
            });
            if (user) {
                return {
                    ...user,
                    isDev: user.dev,
                    followersCount: user._count.followers,
                    followingsCount: user._count.following,
                    amIFollowing:
                        user?.followers.length > 0 &&
                        user?.followers.some(
                            (obj) => obj.followerId === ctx.session?.user.id
                        ),
                };
            } else {
                return null;
            }
        }),
    //
    // Get user for settings
    //
    getUserForSettings: protectedProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            const currentUser = ctx.session.user;
            if (
                typeof input.username !== "undefined" &&
                currentUser.name !== input.username
            ) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have access to this profile.",
                });
            }
            return ctx.prisma.user.findFirst({
                where: {
                    name: input.username,
                },
            });
        }),
    //
    // Edit user details such as bio, bioLink, displayName etc..
    //
    editUserDetails: protectedProcedure
        .input(editUserDetailsSchema)
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit("change_username");
            if (!success)
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message:
                        "You are doing that too often. Try again in 1 minute.",
                });
            const { image, header, ...rest } = input;
            const updateUser = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    ...rest,
                    ...(image && { image: image }),
                    ...(header && { header: header }),
                },
            });

            if (!updateUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not update user details.",
                });
            }
            return {
                displayName: updateUser.displayName,
                header: updateUser.header,
                image: updateUser.image,
                bio: updateUser.bio,
                bioLink: updateUser.bioLink,
                id: updateUser.id,
            };
        }),
    //
    // Change username
    //
    changeUsername: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const updateUser = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    name: input.name,
                    usernameChangeDate: new Date(),
                },
            });
            if (!updateUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not update username.",
                });
            }
            return {
                newUsername: updateUser.name,
            };
        }),
    //
    //  Check if username exists
    //
    checkUsername: protectedProcedure
        .input(z.object({ username: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const check = await ctx.prisma.user.findFirst({
                where: {
                    name: input.username,
                },
            });
            if (check) {
                return {
                    usernameTaken: true,
                };
            } else {
                return {
                    usernameTaken: false,
                };
            }
        }),
    //
    // Add entry to favourite movies
    //
    addToFavouriteMovies: protectedProcedure
        .input(z.object({ movieId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;
            const existing = await ctx.prisma.favouriteMovies.findFirst({
                where: {
                    movieId: input.movieId,
                    userId: currentUserId,
                },
            });
            if (existing)
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Movie is already in your favourites.",
                });
            const entry = await ctx.prisma.favouriteMovies.create({
                data: {
                    movieId: input.movieId,
                    userId: currentUserId,
                },
            });
            if (entry) {
                await createNewActivity({
                    currentUserId,
                    idMap: [{ favouriteMovieId: entry.id }],
                });
                return entry;
            } else {
                return null;
            }
        }),
    deleteFromFavouriteMovies: protectedProcedure
        .input(z.object({ movieId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;
            const deleted = await ctx.prisma.favouriteMovies.delete({
                where: {
                    movieId_userId: {
                        movieId: input.movieId,
                        userId: currentUserId,
                    },
                },
                select: {
                    movie: true,
                },
            });
            if (deleted)
                return {
                    deleted: true,
                    movie: deleted.movie.title,
                };
            else {
                return false;
            }
        }),
    //
    // Get favourite movies for specific user
    //
    getFavouriteMoviesForUser: publicProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    name: input.username,
                },
            });
            if (!user)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found",
                });
            return await ctx.prisma.favouriteMovies.findMany({
                take: 6,
                where: {
                    userId: user.id,
                },
                include: {
                    movie: true,
                },
            });
        }),
    //
    // Register
    //
    register: publicProcedure
        .input(
            z.object({
                email: z.string(),
                username: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { email, password, username } = input;
            if (!email || !password || !username) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "All fields must be supplied",
                });
            }

            const emailExists = await ctx.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            const nameExists = await ctx.prisma.user.findFirst({
                where: {
                    name: username,
                },
            });

            if (emailExists ?? nameExists) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User already exists",
                });
            }

            const hashedPassword = await hash(password);

            const user = await ctx.prisma.user.create({
                data: {
                    name: username,
                    email: email,
                    password: hashedPassword,
                },
                select: {
                    name: true,
                    email: true,
                    createdAt: true,
                },
            });

            return user;
        }),
});
