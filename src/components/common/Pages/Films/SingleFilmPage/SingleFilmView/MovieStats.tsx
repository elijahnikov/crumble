import { api } from "@/utils/api";
import clxsm from "@/utils/clsxm";
import { numberFormatWithSuffix } from "@/utils/general/numberFormat";
import { BsFillEyeFill, BsFillGridFill, BsFillHeartFill } from "react-icons/bs";

interface MovieStatsProps {
    movieId: number;
}

const MovieStats = ({ movieId }: MovieStatsProps) => {
    const { data: extraMovieData, isLoading: isExtraMovieDataLoading } =
        api.movie.film.useQuery({
            id: movieId,
        });

    return (
        <div className="ml-7 mt-5">
            {isExtraMovieDataLoading && (
                <div className={clxsm("bg-muted animate-pulse rounded-md")} />
            )}
            {extraMovieData && (
                <div className="flex space-x-3">
                    <div className="flex space-x-1">
                        <BsFillEyeFill className="fill-slate-600 dark:fill-slate-400" />
                        <p className="text-xs dark:text-slate-300">
                            {numberFormatWithSuffix(
                                extraMovieData.data.watchedCount
                            )}
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        <BsFillGridFill className=" fill-slate-600 dark:fill-slate-400" />
                        <p className="text-xs dark:text-slate-300">
                            {numberFormatWithSuffix(
                                extraMovieData.data.listCount
                            )}
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        <BsFillHeartFill className="fill-slate-600 dark:fill-slate-400" />
                        <p className="text-xs dark:text-slate-300">
                            {numberFormatWithSuffix(
                                extraMovieData.data.likeCount
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieStats;
