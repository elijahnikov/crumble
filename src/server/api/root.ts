import { createTRPCRouter } from "@/server/api/trpc";
// User
import { userRouter } from "./routers/user";
// Movie
import { movieRouter } from "./routers/movie";
// Review
import { reviewRouter } from "./routers/review";
// Watched
import { watchedRouter } from "./routers/watched";

export const appRouter = createTRPCRouter({
    user: userRouter,
    movie: movieRouter,
    review: reviewRouter,
    watched: watchedRouter,
});

export type AppRouter = typeof appRouter;
