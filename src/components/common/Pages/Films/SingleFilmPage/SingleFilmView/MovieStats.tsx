import { numberFormatWithSuffix } from "@/utils/general/numberFormat";
import { BsFillEyeFill, BsFillGridFill, BsFillHeartFill } from "react-icons/bs";

interface MovieStatsProps {
    watchedCount?: number;
    listCount?: number;
    likeCount?: number;
}

const MovieStats = ({
    watchedCount,
    listCount,
    likeCount,
}: MovieStatsProps) => {
    return (
        <div className="ml-12 mt-5">
            <div className="flex space-x-3">
                <div className="flex space-x-1">
                    <BsFillEyeFill className="fill-slate-600 dark:fill-slate-400" />
                    <p className="text-xs dark:text-slate-300">
                        {watchedCount
                            ? numberFormatWithSuffix(watchedCount)
                            : 0}
                    </p>
                </div>
                <div className="flex space-x-1">
                    <BsFillGridFill className=" fill-slate-600 dark:fill-slate-400" />
                    <p className="text-xs dark:text-slate-300">
                        {listCount ? numberFormatWithSuffix(listCount) : 0}
                    </p>
                </div>
                <div className="flex space-x-1">
                    <BsFillHeartFill className="fill-slate-600 dark:fill-slate-400" />
                    <p className="text-xs dark:text-slate-300">
                        {likeCount ? numberFormatWithSuffix(likeCount) : 0}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieStats;
