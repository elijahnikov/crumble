import { z } from "zod";

export const newReviewSchema = z.object({
    movieId: z.number(),
    text: z.string(),
    moviePoster: z.string().optional(),
    backdrop: z.string().optional(),
    watchedOn: z.string(),
    movieTitle: z.string(),
    movieReleaseYear: z.string(),
    ratingGiven: z.number(),
    containsSpoilers: z.boolean(),
    tags: z.string(),
});
export type INewReviewSchema = z.infer<typeof newReviewSchema>;

export const reviewsSchema = z.object({
    limit: z.number().optional(),
    cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    movieId: z.number().optional(),
    orderBy: z.string().optional(),
    orderDirection: z.enum(["desc", "asc"]).optional(),
    dateSortBy: z.date().optional(),
    username: z.string().optional(),
});
export type IReviewsSchema = z.infer<typeof reviewsSchema>;
