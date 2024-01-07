import { api } from "@/utils/api";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";
import MovieImage from "../../AllMovies/MovieImage/MovieImage";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

const RecentlyReviewed = () => {
    const { data, isLoading } = api.review.reviews.useQuery({
        limit: 10,
        dateSortBy: getDatesToSortBy("3 months"),
        orderBy: "createdAt",
        orderDirection: "desc",
    });
    return (
        <div>
            <div>
                <h4 className="text-sm text-slate-600 dark:text-slate-400">
                    Recently Reviewed
                </h4>
            </div>
            {isLoading && (
                <div className="mx-auto mt-5 flex w-full justify-center text-center">
                    <LoadingSpinner size={30} />
                </div>
            )}
            {!isLoading && (
                <div className="grid w-full grid-cols-5 gap-3 py-2 dark:border-slate-700 md:grid-cols-10">
                    {[...data!.reviews, ...data!.reviews]
                        .slice(0, 10)
                        .map((review) => (
                            <MovieImage
                                key={review.id}
                                movie={{
                                    movieId: review.movieId,
                                    poster: review.moviePoster ?? null,
                                    title: review.movieTitle,
                                }}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default RecentlyReviewed;
