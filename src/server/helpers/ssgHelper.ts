import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../api/root";
import { prisma } from "../db";
import superjson from "superjson";
import { getSession } from "next-auth/react";

export const generateSSGHelper = async () => {
    const session = await getSession();
    return createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: undefined, session },
        transformer: superjson,
    });
};
