import { createTRPCRouter, protectedProcedure } from "../trpc";
import { setPrivacySettingsSchema } from "../schemas/privacy";

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
            return ctx.prisma.session.update({
                where: { id: ctx.session.user.id },
                data: {
                    ...input,
                },
            });
        }),
});
