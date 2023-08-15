import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { movieRouter } from "./routers/movie";
import { reviewRouter } from "./routers/review";

export const appRouter = createTRPCRouter({
    user: userRouter,
    movie: movieRouter,
    review: reviewRouter,
});

export type AppRouter = typeof appRouter;
