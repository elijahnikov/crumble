import { createTRPCRouter, protectedProcedure } from "../trpc";
import { setPrivacySettingsSchema } from "../schemas/privacy";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "20 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export const privacySettingsRouter = createTRPCRouter({
    //
    // Get privacy settings for user
    //
    getPrivacySettingsByUserId: protectedProcedure.query(async ({ ctx }) => {
        const currentUserId = ctx.session.user.id;
        return ctx.prisma.privacy.findFirst({
            where: {
                userId: currentUserId,
            },
        });
    }),
    //
    // Setting privacy settings for user
    //
    setPrivacySettings: protectedProcedure
        .input(setPrivacySettingsSchema)
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit(
                "update_user_privacy_settings"
            );
            if (!success)
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message:
                        "You are doing that too often. Try again in 20 seconds.",
                });
            const currentUserId = ctx.session.user.id;
            const { setting, value } = input;
            return ctx.prisma.privacy.updateMany({
                where: { userId: currentUserId },
                data: {
                    [setting]: value,
                },
            });
        }),
});
