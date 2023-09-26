import { z } from "zod";

export const watchedSchema = z.object({
    limit: z.number().optional(),
    cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    username: z.string(),
});

export const createWatchedSchema = z.object({
    movieId: z.number(),
    movieTitle: z.string(),
    ratingGiven: z.number().optional(),
    poster: z.string().optional(),
    withReview: z.boolean().optional(),
});
