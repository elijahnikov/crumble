-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "name" TEXT,
    "bio" TEXT,
    "bioLink" TEXT,
    "displayName" TEXT,
    "header" TEXT,
    "totalHoursWatched" INTEGER NOT NULL DEFAULT 0,
    "totalListsCreated" INTEGER NOT NULL DEFAULT 0,
    "usernameChangeDate" TIMESTAMP(3),
    "verified" BOOLEAN DEFAULT false,
    "dev" BOOLEAN DEFAULT false,
    "totalMoviesWatched" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "containsSpoilers" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    "moviePoster" TEXT,
    "backdrop" TEXT,
    "movieTitle" TEXT NOT NULL,
    "movieReleaseYear" TEXT NOT NULL,
    "ratingGiven" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "watchedOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewLike" (
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "ReviewLike_pkey" PRIMARY KEY ("userId","reviewId")
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewCommentLike" (
    "userId" TEXT NOT NULL,
    "reviewCommentId" TEXT NOT NULL,

    CONSTRAINT "ReviewCommentLike_pkey" PRIMARY KEY ("userId","reviewCommentId")
);

-- CreateTable
CREATE TABLE "ReviewTag" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "poster" TEXT,
    "backdrop" TEXT,
    "releaseDate" TEXT NOT NULL,
    "numberOfRatings" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "watchedCount" INTEGER NOT NULL DEFAULT 0,
    "listCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavouriteMovies" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavouriteMovies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watched" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "movieTitle" TEXT NOT NULL,
    "poster" TEXT,
    "ratingGiven" INTEGER,
    "rewatch" BOOLEAN DEFAULT false,
    "reviewLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watched_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "numberOfFilms" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListLike" (
    "userId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "ListLike_pkey" PRIMARY KEY ("userId","listId")
);

-- CreateTable
CREATE TABLE "ListComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListCommentLike" (
    "userId" TEXT NOT NULL,
    "listCommentId" TEXT NOT NULL,

    CONSTRAINT "ListCommentLike_pkey" PRIMARY KEY ("userId","listCommentId")
);

-- CreateTable
CREATE TABLE "ListTags" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListEntry" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "listId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT,
    "favouriteMovieId" TEXT,
    "watchedId" TEXT,
    "listId" TEXT,
    "listEntryId" TEXT,
    "userId" TEXT NOT NULL,
    "watchlistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "followerId" TEXT,
    "followingId" TEXT,
    "userId" TEXT,
    "reviewId" TEXT,
    "reviewCommentId" TEXT,
    "notifiedId" TEXT NOT NULL,
    "notifierId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Privacy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "privateAccount" BOOLEAN NOT NULL DEFAULT false,
    "showListsInActivity" BOOLEAN NOT NULL DEFAULT true,
    "showListEntryInActivity" BOOLEAN NOT NULL DEFAULT true,
    "showWatchedInActivity" BOOLEAN NOT NULL DEFAULT true,
    "showReviewInActivity" BOOLEAN NOT NULL DEFAULT true,
    "showFavouriteMovieInActivity" BOOLEAN NOT NULL DEFAULT true,
    "showReviewLikeInActivity" BOOLEAN NOT NULL DEFAULT true,
    "showWatchlistEntryInActivity" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Privacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_createdAt_id_key" ON "User"("createdAt", "id");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_createdAt_id_key" ON "Review"("createdAt", "id");

-- CreateIndex
CREATE INDEX "ReviewLike_userId_idx" ON "ReviewLike"("userId");

-- CreateIndex
CREATE INDEX "ReviewLike_reviewId_idx" ON "ReviewLike"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewComment_reviewId_idx" ON "ReviewComment"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewComment_userId_idx" ON "ReviewComment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewComment_createdAt_id_key" ON "ReviewComment"("createdAt", "id");

-- CreateIndex
CREATE INDEX "ReviewCommentLike_userId_idx" ON "ReviewCommentLike"("userId");

-- CreateIndex
CREATE INDEX "ReviewCommentLike_reviewCommentId_idx" ON "ReviewCommentLike"("reviewCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_movieId_key" ON "Movie"("movieId");

-- CreateIndex
CREATE INDEX "FavouriteMovies_userId_idx" ON "FavouriteMovies"("userId");

-- CreateIndex
CREATE INDEX "FavouriteMovies_movieId_idx" ON "FavouriteMovies"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteMovies_movieId_userId_key" ON "FavouriteMovies"("movieId", "userId");

-- CreateIndex
CREATE INDEX "Watched_userId_idx" ON "Watched"("userId");

-- CreateIndex
CREATE INDEX "Watched_movieId_idx" ON "Watched"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Watched_createdAt_id_key" ON "Watched"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Watched_userId_movieId_key" ON "Watched"("userId", "movieId");

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "List_createdAt_id_key" ON "List"("createdAt", "id");

-- CreateIndex
CREATE INDEX "ListLike_userId_idx" ON "ListLike"("userId");

-- CreateIndex
CREATE INDEX "ListLike_listId_idx" ON "ListLike"("listId");

-- CreateIndex
CREATE INDEX "ListComment_listId_idx" ON "ListComment"("listId");

-- CreateIndex
CREATE INDEX "ListComment_userId_idx" ON "ListComment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ListComment_createdAt_id_key" ON "ListComment"("createdAt", "id");

-- CreateIndex
CREATE INDEX "ListCommentLike_userId_idx" ON "ListCommentLike"("userId");

-- CreateIndex
CREATE INDEX "ListCommentLike_listCommentId_idx" ON "ListCommentLike"("listCommentId");

-- CreateIndex
CREATE INDEX "ListEntry_listId_idx" ON "ListEntry"("listId");

-- CreateIndex
CREATE INDEX "ListEntry_movieId_idx" ON "ListEntry"("movieId");

-- CreateIndex
CREATE INDEX "Subscription_followingId_idx" ON "Subscription"("followingId");

-- CreateIndex
CREATE INDEX "Subscription_followerId_idx" ON "Subscription"("followerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_followerId_followingId_key" ON "Subscription"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_followingId_followerId_key" ON "Subscription"("followingId", "followerId");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Activity_listId_idx" ON "Activity"("listId");

-- CreateIndex
CREATE INDEX "Activity_watchedId_idx" ON "Activity"("watchedId");

-- CreateIndex
CREATE INDEX "Activity_favouriteMovieId_idx" ON "Activity"("favouriteMovieId");

-- CreateIndex
CREATE INDEX "Activity_reviewId_idx" ON "Activity"("reviewId");

-- CreateIndex
CREATE INDEX "Activity_listEntryId_idx" ON "Activity"("listEntryId");

-- CreateIndex
CREATE INDEX "Activity_userId_reviewId_idx" ON "Activity"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "Activity_watchlistId_idx" ON "Activity"("watchlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_createdAt_id_key" ON "Activity"("createdAt", "id");

-- CreateIndex
CREATE INDEX "Notification_followerId_followingId_idx" ON "Notification"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Notification_notifierId_idx" ON "Notification"("notifierId");

-- CreateIndex
CREATE INDEX "Notification_notifiedId_idx" ON "Notification"("notifiedId");

-- CreateIndex
CREATE INDEX "Notification_userId_reviewId_idx" ON "Notification"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "Notification_reviewId_idx" ON "Notification"("reviewId");

-- CreateIndex
CREATE INDEX "Notification_reviewCommentId_idx" ON "Notification"("reviewCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_createdAt_id_key" ON "Notification"("createdAt", "id");

-- CreateIndex
CREATE INDEX "Privacy_userId_idx" ON "Privacy"("userId");

-- CreateIndex
CREATE INDEX "Watchlist_movieId_idx" ON "Watchlist"("movieId");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_createdAt_id_key" ON "Watchlist"("createdAt", "id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewLike" ADD CONSTRAINT "ReviewLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewLike" ADD CONSTRAINT "ReviewLike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCommentLike" ADD CONSTRAINT "ReviewCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCommentLike" ADD CONSTRAINT "ReviewCommentLike_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "ReviewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteMovies" ADD CONSTRAINT "FavouriteMovies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteMovies" ADD CONSTRAINT "FavouriteMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("movieId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("movieId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListLike" ADD CONSTRAINT "ListLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListLike" ADD CONSTRAINT "ListLike_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListComment" ADD CONSTRAINT "ListComment_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListComment" ADD CONSTRAINT "ListComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCommentLike" ADD CONSTRAINT "ListCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCommentLike" ADD CONSTRAINT "ListCommentLike_listCommentId_fkey" FOREIGN KEY ("listCommentId") REFERENCES "ListComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("movieId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_reviewId_fkey" FOREIGN KEY ("userId", "reviewId") REFERENCES "ReviewLike"("userId", "reviewId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_favouriteMovieId_fkey" FOREIGN KEY ("favouriteMovieId") REFERENCES "FavouriteMovies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_watchedId_fkey" FOREIGN KEY ("watchedId") REFERENCES "Watched"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_listEntryId_fkey" FOREIGN KEY ("listEntryId") REFERENCES "ListEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followerId_followingId_fkey" FOREIGN KEY ("followerId", "followingId") REFERENCES "Subscription"("followerId", "followingId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_reviewId_fkey" FOREIGN KEY ("userId", "reviewId") REFERENCES "ReviewLike"("userId", "reviewId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "ReviewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifiedId_fkey" FOREIGN KEY ("notifiedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifierId_fkey" FOREIGN KEY ("notifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Privacy" ADD CONSTRAINT "Privacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("movieId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
