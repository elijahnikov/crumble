import { z } from "zod";

export const listsSchema = z.object({
    limit: z.number().optional(),
    cursor: z.object({ id: z.string(), createdAt: z.date() }),
});
export type IListsSchema = z.infer<typeof listsSchema>;

export const createListSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.string().optional(),
    posterPathOne: z.string().optional(),
    posterPathTwo: z.string().optional(),
    posterPathThree: z.string().optional(),
    posterPathFour: z.string().optional(),
    posterPathFive: z.string().optional(),
    movieIds: z.array(z.number()),
});

export const updateListSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    id: z.string(),
});
