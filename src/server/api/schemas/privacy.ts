import { z } from "zod";

export const setPrivacySettingsSchema = z.object({
    userId: z.string(),
    private: z.boolean().optional(),
    showListsInActivity: z.boolean().optional(),
    showListEntryInActivity: z.boolean().optional(),
    showWatchedInActivity: z.boolean().optional(),
    showReviewInActivity: z.boolean().optional(),
    showFavouriteMovieInActivity: z.boolean().optional(),
});
