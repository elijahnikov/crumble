import { z } from "zod";

export const movieSchema = z.object({
    movieId: z.number(),
    title: z.string(),
    releaseDate: z.string(),
    poster: z.string().optional(),
    overview: z.string().nullable(),
    backdrop: z.string().optional(),
});

export const createMovieSchema = z.object({
    movieId: z.number(),
    title: z.string(),
    releaseDate: z.string(),
    poster: z.string().optional(),
    overview: z.string().nullable(),
    backdrop: z.string().optional(),
    fromReview: z.boolean().default(false),
    rating: z.number().default(0),
});

export type IMovie = z.infer<typeof movieSchema>;

export const movieFetchSchema = z
    .object({
        id: z.number(),
        original_title: z.string(),
        release_date: z.string(),
        poster_path: z.string().nullable(),
        backdrop_path: z.string().nullable(),
        overview: z.string().nullable(),
    })
    .transform(
        ({
            backdrop_path,
            id,
            original_title,
            poster_path,
            release_date,
            overview,
            ...rest
        }) => ({
            backdrop: backdrop_path ?? "",
            movieId: id,
            title: original_title,
            overview: overview ?? "",
            poster: poster_path ?? "",
            releaseDate: release_date,
            ...rest,
        })
    );
export type IMovieFetch = z.infer<typeof movieFetchSchema>;
