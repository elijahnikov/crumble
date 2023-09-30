import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const privacySettingsRouter = createTRPCRouter({
    //
    // Get privacy settings for user
    //
    getPrivacySettingsByUserId: protectedProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;
            const hasPermission = await ctx.prisma.user
                .findFirst({
                    where: {
                        name: input.username,
                    },
                })
                .then((r) => r === null || r.id === currentUserId);
            if (!hasPermission) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have access to this profile.",
                });
            }
        }),
});
