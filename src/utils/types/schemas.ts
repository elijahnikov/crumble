import { z } from "zod";

export const movieDetailsFetchSchema = z.object({
    adult: z.boolean(),
    backdrop_path: z.string(),
    belongs_to_collection: z
        .object({
            id: z.number(),
            name: z.string(),
            poster_path: z.string(),
            backdrop_path: z.string(),
        })
        .nullable(),
    budget: z.number(),
    genres: z.array(z.object({ id: z.number(), name: z.string() })),
    homepage: z.string(),
    id: z.number(),
    imdb_id: z.string(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string(),
    production_companies: z.array(
        z.object({
            id: z.number(),
            logo_path: z.string().nullable(),
            name: z.string(),
            origin_country: z.string(),
        })
    ),
    production_countries: z.array(
        z.object({ iso_3166_1: z.string(), name: z.string() })
    ),
    release_date: z.string(),
    revenue: z.number(),
    runtime: z.number(),
    spoken_languages: z.array(
        z.object({
            english_name: z.string(),
            iso_639_1: z.string(),
            name: z.string(),
        })
    ),
    status: z.string(),
    tagline: z.string(),
    title: z.string(),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number(),
    videos: z.object({
        results: z.array(
            z.object({
                iso_639_1: z.string(),
                iso_3166_1: z.string(),
                name: z.string(),
                key: z.string(),
                site: z.string(),
                size: z.number(),
                type: z.string(),
                official: z.boolean(),
                published_at: z.string(),
                id: z.string(),
            })
        ),
    }),
    images: z.object({
        backdrops: z.array(z.unknown()),
        logos: z.array(z.unknown()),
        posters: z.array(z.unknown()),
    }),
    credits: z.object({
        cast: z.array(
            z.union([
                z.object({
                    adult: z.boolean(),
                    gender: z.number(),
                    id: z.number(),
                    known_for_department: z.string(),
                    name: z.string(),
                    original_name: z.string(),
                    popularity: z.number(),
                    profile_path: z.string(),
                    cast_id: z.number(),
                    character: z.string(),
                    credit_id: z.string(),
                    order: z.number(),
                }),
                z.object({
                    adult: z.boolean(),
                    gender: z.number(),
                    id: z.number(),
                    known_for_department: z.string(),
                    name: z.string(),
                    original_name: z.string(),
                    popularity: z.number(),
                    profile_path: z.null(),
                    cast_id: z.number(),
                    character: z.string(),
                    credit_id: z.string(),
                    order: z.number(),
                }),
            ])
        ),
        crew: z.array(
            z.union([
                z.object({
                    adult: z.boolean(),
                    gender: z.number(),
                    id: z.number(),
                    known_for_department: z.string(),
                    name: z.string(),
                    original_name: z.string(),
                    popularity: z.number(),
                    profile_path: z.string(),
                    credit_id: z.string(),
                    department: z.string(),
                    job: z.string(),
                }),
                z.object({
                    adult: z.boolean(),
                    gender: z.number(),
                    id: z.number(),
                    known_for_department: z.string(),
                    name: z.string(),
                    original_name: z.string(),
                    popularity: z.number(),
                    profile_path: z.null(),
                    credit_id: z.string(),
                    department: z.string(),
                    job: z.string(),
                }),
            ])
        ),
    }),
    alternative_titles: z.object({
        titles: z.array(
            z.object({
                iso_3166_1: z.string(),
                title: z.string(),
                type: z.string(),
            })
        ),
    }),
});

export type IMovieDetailsFetchSchema = z.infer<typeof movieDetailsFetchSchema>;
