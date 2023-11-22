import { z } from "zod";

export const personDetailsFetchSchema = z
    .object({
        adult: z.boolean(),
        also_known_as: z.array(z.string()),
        biography: z.string(),
        birthday: z.string(),
        deathday: z.null(),
        gender: z.number(),
        homepage: z.null(),
        id: z.number(),
        imdb_id: z.string(),
        known_for_department: z.string(),
        name: z.string(),
        place_of_birth: z.string(),
        popularity: z.number(),
        profile_path: z.string(),
    })
    .transform(
        ({
            also_known_as,
            place_of_birth,
            imdb_id,
            known_for_department,
            profile_path,
            ...rest
        }) => ({
            alsoKnownAs: also_known_as,
            placeOfBirth: place_of_birth,
            imdbId: imdb_id,
            knownForDepartment: known_for_department,
            picture: profile_path,
            ...rest,
        })
    );

export type IPersonDetailsFetch = z.infer<typeof personDetailsFetchSchema>;
