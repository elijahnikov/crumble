/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { env } from "@/env.mjs";
import type { z } from "zod";

export const zodFetch = async <T extends z.Schema>(url: string, schema: T) => {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
    });

    const data = await res.json();
    if (data.results) {
        return data.results.map((d: unknown) => {
            return schema.parse(d);
        });
    } else {
        return schema.parse(data);
    }
};
