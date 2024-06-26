import { numberFormatWithSuffix } from "@/utils/general/numberFormat";

interface MovieStatsProps {
    watchedCount?: number;
    listCount?: number;
    likeCount?: number;
    ratings?: number;
}

const MovieStats = ({
    watchedCount,
    listCount,
    likeCount,
    ratings,
}: MovieStatsProps) => {
    return (
        <div className="mt-5 space-y-1">
            <div className="flex w-full justify-between pl-5 pr-5">
                <p className="pt-1 text-xs text-slate-600 dark:text-slate-400">
                    Views
                </p>
                <p className="text-md font-semibold text-slate-700 dark:text-slate-200">
                    {numberFormatWithSuffix(watchedCount ?? 0)}
                </p>
            </div>
            <div className="flex w-full justify-between pl-5 pr-5">
                <p className="pt-1 text-xs text-slate-600 dark:text-slate-400">
                    Likes
                </p>
                <p className="text-md font-semibold text-slate-700 dark:text-slate-200">
                    {numberFormatWithSuffix(likeCount ?? 0)}
                </p>
            </div>
            <div className="flex w-full justify-between pl-5 pr-5">
                <p className="pt-1 text-xs text-slate-600 dark:text-slate-400">
                    Lists
                </p>
                <p className="text-md font-semibold text-slate-700 dark:text-slate-200">
                    {numberFormatWithSuffix(listCount ?? 0)}
                </p>
            </div>
            <div className="flex w-full justify-between pl-5 pr-5">
                <p className="pt-1 text-xs text-slate-600 dark:text-slate-400">
                    Ratings
                </p>
                <p className="text-md font-semibold text-slate-700 dark:text-slate-200">
                    {numberFormatWithSuffix(ratings ?? 0)}
                </p>
            </div>
        </div>
    );
};

export default MovieStats;
