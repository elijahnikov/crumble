import { z } from "zod";

export const newActivitySchema = z
    .object({
        action: z.string(),
        reviewId: z.string().optional(),
        favouriteMovieId: z.string().optional(),
        watchedId: z.string().optional(),
        listId: z.string().optional(),
        listEntryId: z.string().optional(),
    })
    .refine((data) => {
        const optionalFields = [
            data.reviewId,
            data.favouriteMovieId,
            data.listEntryId,
            data.listId,
            data.watchedId,
        ];

        return optionalFields.some((field) => field !== undefined);
    });

export type INewActivitySchema = z.infer<typeof newActivitySchema>;
