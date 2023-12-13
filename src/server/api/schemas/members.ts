import { z } from "zod";

export const membersSchema = z.object({
    limit: z.number().optional(),
    cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    orderBy: z.string().optional(),
    orderDirection: z.enum(["desc", "asc"]).optional(),
    dateSortBy: z.date().optional(),
});
