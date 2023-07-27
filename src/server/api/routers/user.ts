import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { verify } from "argon2";
import { editUserDetailsSchema } from "../schemas/user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // Get user by username
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          name: input.username,
        },
      });
    }),
  // Edit user details such as bio, bioLink, displayName etc..
  editUserDetails: protectedProcedure
    .input(editUserDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      const updateUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
      });

      if (!updateUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not update user details.",
        });
      }
      return {
        name: updateUser.name,
        email: updateUser.email,
        id: updateUser.id,
      };
    }),
  // Change username
  changeUsername: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updateUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
      if (!updateUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not update username.",
        });
      }
    }),
});
