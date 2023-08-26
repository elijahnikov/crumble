/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { env } from "@/env.mjs";
import type { ZodSchema } from "zod";

export const fetchWithZod = async <T>(
    url: string,
    schema: ZodSchema<T>
): Promise<T> => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
        });
        const data = await response.json();

        if (data.results) {
            return data.results.map((d: typeof schema) => {
                return schema.parse(d);
            });
        } else {
            return schema.parse(data);
        }
    } catch (error) {
        console.error("Error fetching and parsing data:", error);
        throw error;
    }
};
