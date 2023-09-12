import { createTRPCRouter } from "@/server/api/trpc";
// User
import { userRouter } from "./routers/user";
// Movie
import { movieRouter } from "./routers/movie";
// Review
import { reviewRouter } from "./routers/review";
// Watched
import { watchedRouter } from "./routers/watched";
// List
import { listRouter } from "./routers/list";
import { s3Router } from "./routers/s3";

export const appRouter = createTRPCRouter({
    user: userRouter,
    movie: movieRouter,
    review: reviewRouter,
    watched: watchedRouter,
    list: listRouter,
    s3: s3Router,
});

export type AppRouter = typeof appRouter;
