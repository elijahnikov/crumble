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
// S3
import { s3Router } from "./routers/s3";
// Subscription
import { subscriptionRouter } from "./routers/subscription";
// Activity
import { activityRouter } from "./routers/activity";
// Privacy
import { privacySettingsRouter } from "./routers/privacy";

export const appRouter = createTRPCRouter({
    user: userRouter,
    movie: movieRouter,
    review: reviewRouter,
    watched: watchedRouter,
    list: listRouter,
    s3: s3Router,
    subscription: subscriptionRouter,
    activity: activityRouter,
    privacy: privacySettingsRouter,
});

export type AppRouter = typeof appRouter;
