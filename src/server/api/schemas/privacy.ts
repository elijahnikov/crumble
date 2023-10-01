import { z } from "zod";

export const setPrivacySettingsSchema = z.object({
    setting: z.string(),
    value: z.boolean(),
});
