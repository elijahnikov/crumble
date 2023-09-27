import { z } from "zod";

export const listsSchema = z.object({
    limit: z.number().optional(),
    username: z.string().optional(),
    cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    orderBy: z.string().optional(),
    orderDirection: z.enum(["desc", "asc"]).optional(),
    dateSortBy: z.date().optional(),
});
export type IListsSchema = z.infer<typeof listsSchema>;

export const createListSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.string().optional(),
    movieIds: z.array(z.number()),
});

export const updateListSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    id: z.string(),
});
