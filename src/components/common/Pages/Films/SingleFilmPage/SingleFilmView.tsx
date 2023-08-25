import type { movieDetailsFetchSchema } from "@/utils/types/schemas";
import Image from "next/image";
import React from "react";
import type { z } from "zod";

interface SingleFilmViewProps {
    movieData: z.infer<typeof movieDetailsFetchSchema>;
}

const SingleFilmView = ({ movieData }: SingleFilmViewProps) => {
    return (
        <>
            <div className="rounded-md border-[1px] border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-brand-light">
                <div className="w-[100%] pb-5">
                    <div className="relative w-[100%]">
                        {movieData.backdrop_path && (
                            <Image
                                src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`}
                                alt={movieData.title}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="rounded-lg  opacity-70"
                                style={{ width: "100%", height: "20%" }}
                            />
                        )}
                        <Image
                            width={128}
                            height={128}
                            className="absolute bottom-12 left-0 -mb-[64px] ml-4 rounded-md drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
                            src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`}
                            alt="Profile picture"
                        />
                        <div className="ml-[170px] mt-[22px]">
                            <div className="flex space-x-2">
                                <h2>{movieData.title}</h2>
                                <p className="mt-[7px] text-lg text-crumble">
                                    {movieData.release_date.slice(0, 4)}
                                </p>
                            </div>
                            <span className="flex text-sm text-gray-600 dark:text-gray-300">
                                <p className="mr-1">Directed by </p>
                                {movieData.credits.crew
                                    .filter((crew) => {
                                        return crew.job === "Director";
                                    })
                                    .map((director) => {
                                        return director.name;
                                    })
                                    .join(" and ")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleFilmView;
