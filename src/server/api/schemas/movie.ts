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

export const extraMovieDetailsSchema = z.object({
    runtime: z.number(),
});

export const createManyMoviesSchema = createMovieSchema
    .omit({ fromReview: true })
    .array();

export type IMovieDetails = z.infer<typeof extraMovieDetailsSchema>;
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

export const movieDetailsFetchSchema = z.object({
    runtime: z.number(),
});
export type IMovieDetailsFetch = z.infer<typeof movieDetailsFetchSchema>;

export const allMovieDetailsFetchSchema = z
    .object({
        adult: z.boolean(),
        backdrop_path: z.string().nullable(),
        genre_ids: z.number().array(),
        id: z.number(),
        original_language: z.string(),
        original_title: z.string(),
        overview: z.string().nullable(),
        popularity: z.number(),
        poster_path: z.string().nullable(),
        release_date: z.string(),
        title: z.string(),
        video: z.boolean(),
        vote_average: z.number(),
        vote_count: z.number(),
    })
    .transform(
        ({
            backdrop_path,
            id,
            poster_path,
            release_date,
            original_title,
            overview,
            ...rest
        }) => ({
            backdrop: backdrop_path ?? "",
            movieId: id,
            movieTitle: original_title,
            overview: overview ?? "",
            poster: poster_path ?? "",
            releaseDate: release_date,
            ...rest,
        })
    );

export type IAllMovieDetailsFetch = z.infer<typeof movieFetchSchema>;
