import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { editUserDetailsSchema } from "../schemas/user";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";

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
                include: {
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
                },
            });
            if (user) {
                return {
                    ...user,
                    isDev: user.dev,
                    followersCount: user._count.followers,
                    followingsCount: user._count.following,
                    amIFollowing:
                        user?.followers.length > 0 && ctx.session?.user.id,
                };
            } else {
                return null;
            }
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
                    ...(header && { image: header }),
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
});
