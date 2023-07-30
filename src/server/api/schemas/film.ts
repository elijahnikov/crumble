import { z } from "zod";

export const filmSchema = z.object({
    filmId: z.number(),
    movieTitle: z.string(),
    releaseDate: z.string(),
    poster: z.string().optional(),
    overview: z.string().optional(),
    backdrop: z.string().optional(),
});
export type IFilm = z.infer<typeof filmSchema>;

export const filmFetchSchema = z
    .object({
        id: z.number(),
        original_title: z.string(),
        release_date: z.string(),
        poster_path: z.string().nullable(),
        backdrop_path: z.string().nullable(),
        overview: z.string(),
    })
    .transform(
        ({
            backdrop_path,
            id,
            original_title,
            poster_path,
            release_date,
            ...rest
        }) => ({
            backdrop: backdrop_path,
            filmId: id,
            movieTitle: original_title,
            poster: poster_path,
            releaseDate: release_date,
            ...rest,
        })
    );
export type IFilmFetch = z.infer<typeof filmFetchSchema>;
