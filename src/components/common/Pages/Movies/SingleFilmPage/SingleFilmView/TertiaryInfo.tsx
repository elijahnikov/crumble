import React from "react";
import { BsFlag } from "react-icons/bs";

interface TertiaryInfoProps {
    runtime: number;
    imdbLink: string;
    tmdbLink: number;
}

const TertiaryInfo = ({ runtime, imdbLink, tmdbLink }: TertiaryInfoProps) => {
    return (
        <div>
            <div className="inline">
                <p className="inline text-xs text-slate-600 dark:text-gray-400">
                    {runtime} mins
                </p>
            </div>
            <a
                target="_blank"
                href={`https://www.imdb.com/title/${imdbLink}`}
                className="ml-3 inline cursor-pointer rounded-sm border-[1px] border-gray-600 p-1 text-[9px] text-slate-600 dark:text-gray-300"
            >
                IMDB
            </a>
            <a
                target="_blank"
                href={`https://www.themoviedb.org/movie/${tmdbLink}`}
                className="ml-3 inline cursor-pointer rounded-sm border-[1px] border-gray-600 p-1 text-[9px] text-slate-600 dark:text-gray-300"
            >
                TMDB
            </a>
            <BsFlag className="ml-3 inline h-[15px] w-[15px] cursor-pointer fill-slate-600 hover:fill-slate-500 dark:fill-gray-400 dark:hover:fill-gray-300" />
        </div>
    );
};

export default TertiaryInfo;
