import CreateReviewModal from "@/components/common/CreateReviewModal/CreateReviewModal";
import type { movieDetailsFetchSchema } from "@/utils/types/schemas";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";
import type { z } from "zod";
import MovieStats from "./MovieStats";
import MovieInfoTabs from "./MovieInfoTabs";
import TertiaryInfo from "./TertiaryInfo";
import { Container } from "@/components/common/Layout/Layout";

interface SingleFilmViewProps {
    movieData: z.infer<typeof movieDetailsFetchSchema>;
}

const SingleFilmView = ({ movieData }: SingleFilmViewProps) => {
    const directors = movieData.credits.crew.filter((crew) => {
        return crew.job === "Director";
    });

    return (
        <>
            <Container>
                <div className="relative w-[100%]">
                    {movieData.backdrop_path && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <Image
                            width={0}
                            height={0}
                            sizes="100vw"
                            src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`}
                            alt={movieData.title}
                            className="h-[250px] rounded-lg object-cover opacity-0 duration-[0.5s]"
                            priority
                            style={{ width: "100%" }}
                            onLoadingComplete={(image) =>
                                image.classList.remove("opacity-0")
                            }
                        />
                    )}
                    <Image
                        width={170}
                        height={170}
                        className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-md opacity-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] duration-[0.5s]"
                        src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`}
                        priority
                        alt="Profile picture"
                        onLoadingComplete={(image) =>
                            image.classList.remove("opacity-0")
                        }
                    />
                    <div className="ml-[230px] mt-[22px]">
                        <div className="flex ">
                            <div className="flex w-[80%] space-x-2">
                                <h2>{movieData.title}</h2>
                                <p className="mt-[7px] text-lg text-crumble">
                                    {movieData.release_date.slice(0, 4)}
                                </p>
                            </div>
                            <div className="relative top-5 text-center">
                                <p className="font-semibold">{3.2}</p>
                                <Rating
                                    emptyStyle={{ display: "flex" }}
                                    fillStyle={{
                                        display: "-webkit-inline-box",
                                    }}
                                    allowFraction={true}
                                    initialValue={3.5}
                                    size={15}
                                    fillColor="#EF4444"
                                />
                            </div>
                        </div>
                        <span className="flex text-sm text-gray-600 dark:text-gray-300">
                            <p className="mr-1">Directed by </p>
                            {directors.map((director, index) => (
                                <p key={index}>
                                    <span className="text-crumble underline">
                                        {director.name}
                                    </span>
                                    {index !== directors.length - 1 && (
                                        <span className="mx-1">and</span>
                                    )}
                                </p>
                            ))}
                        </span>
                    </div>
                </div>
                {/* DESCRIPTION AND STATS */}
                <div className="mb-[20px] flex">
                    <div className="ml-5 mt-[60px] w-[30%] space-y-5 text-center">
                        <MovieStats movieId={movieData.id} />
                        <div>
                            <CreateReviewModal
                                size="sm"
                                movie={{
                                    movieId: movieData.id,
                                    overview: movieData.overview,
                                    releaseDate: movieData.release_date,
                                    title: movieData.title,
                                    backdrop: movieData.backdrop_path,
                                    poster: movieData.poster_path,
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-5 w-[90%] space-y-4 pl-10">
                        <p className="font-semibold text-slate-800 dark:text-slate-400">
                            {movieData.tagline}
                        </p>
                        <p className="w-[90%] text-slate-700 dark:text-slate-300">
                            {movieData.overview}
                        </p>
                        <div className="mt-[20px]">
                            <TertiaryInfo
                                runtime={movieData.runtime}
                                imdbLink={movieData.imdb_id}
                                tmdbLink={movieData.id}
                            />
                        </div>
                    </div>
                </div>
                <MovieInfoTabs
                    movieInfo={{
                        alternative_titles: movieData.alternative_titles,
                        credits: movieData.credits,
                        production_companies: movieData.production_companies,
                        production_countries: movieData.production_countries,
                        spoken_languages: movieData.spoken_languages,
                        genres: movieData.genres,
                    }}
                />
            </Container>
        </>
    );
};

export default SingleFilmView;
