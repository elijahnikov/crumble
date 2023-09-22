import { z } from "zod";

export const editUserDetailsSchema = z.object({
    bio: z.string().optional(),
    bioLink: z.string().optional(),
    displayName: z.string().optional(),
    name: z.string().optional(),
    image: z.string().optional(),
    header: z.string().optional(),
});
export type IEditUserDetails = z.infer<typeof editUserDetailsSchema>;
