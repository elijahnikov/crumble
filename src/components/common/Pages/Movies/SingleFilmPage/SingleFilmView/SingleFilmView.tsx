import CreateReviewModal from "@/components/common/CreateReviewModal/CreateReviewModal";
import type { movieDetailsFetchSchema } from "@/utils/types/schemas";
import Image from "next/image";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import type { z } from "zod";
import MovieStats from "./MovieStats";
import MovieInfoTabs from "./MovieInfoTabs";
import TertiaryInfo from "./TertiaryInfo";
import { Container } from "@/components/common/Layout/Layout";
import { api } from "@/utils/api";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { BsPlus } from "react-icons/bs";
import { BiHeart, BiShare } from "react-icons/bi";
import toast from "react-hot-toast";

interface SingleFilmViewProps {
    movieData: z.infer<typeof movieDetailsFetchSchema>;
}

const SingleFilmView = ({ movieData }: SingleFilmViewProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const directors = movieData.credits.crew.filter((crew) => {
        return crew.job === "Director";
    });

    const { data: extraMovieData } = api.movie.movie.useQuery({
        id: movieData.id,
    });

    const { mutate: addToWatchlist } = api.watchlist.addToWatchlist.useMutation(
        {
            onSuccess: () => {
                toast.success("Added to your watchlist!", {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
            },
        }
    );

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
                        className="absolute bottom-0 left-0 -mb-[50px] ml-4 rounded-md opacity-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] duration-[0.5s]"
                        src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`}
                        priority
                        alt="Profile picture"
                        onLoadingComplete={(image) =>
                            image.classList.remove("opacity-0")
                        }
                    />
                    <div className="ml-[230px] mt-[22px]">
                        <div className="flex">
                            <div className="w-[100%]">
                                <span className="text-md mt-[7px] font-semibold text-crumble">
                                    {movieData.release_date.slice(0, 4)}
                                </span>
                                <h2>{movieData.title}</h2>
                            </div>
                        </div>
                        <div className="mt-2 flex">
                            <p className="mr-1 text-xs text-gray-600 dark:text-gray-300">
                                Directed by{" "}
                            </p>
                            <span className="flex w-[400px] space-x-2  break-words text-xs text-gray-600 dark:text-gray-300">
                                {directors.map((director, index) => (
                                    <p key={index}>
                                        <span className="text-crumble underline">
                                            {director.name}
                                        </span>
                                    </p>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
                {/* DESCRIPTION AND STATS */}
                <div className="mb-[20px] flex">
                    <div className="mt-[60px] min-w-[200px] max-w-[200px] space-y-5 text-center">
                        <div className="mt-4 w-full space-x-2">
                            <CreateReviewModal
                                fromMenu={false}
                                open={open}
                                setOpen={setOpen}
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
                            <div className="mx-auto mt-5 flex w-[92%] justify-center space-x-4">
                                <Tooltip>
                                    <Tooltip.Trigger>
                                        <div
                                            onClick={() => {
                                                addToWatchlist({
                                                    movieId: movieData.id,
                                                });
                                            }}
                                            className="w-max cursor-pointer rounded-md border p-1 dark:border-slate-700"
                                        >
                                            <BsPlus className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        Add to watchlist
                                    </Tooltip.Content>
                                </Tooltip>
                                <Tooltip>
                                    <Tooltip.Trigger>
                                        <div className="w-max cursor-pointer rounded-md border p-1 dark:border-slate-700">
                                            <BiShare className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>Share</Tooltip.Content>
                                </Tooltip>
                                <Tooltip>
                                    <Tooltip.Trigger>
                                        <div className="w-max cursor-pointer rounded-md border p-1 dark:border-slate-700">
                                            <BiHeart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        Add to likes
                                    </Tooltip.Content>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex w-full justify-between pl-4 pr-5">
                            <Rating
                                emptyStyle={{ display: "flex" }}
                                fillStyle={{
                                    display: "-webkit-inline-box",
                                }}
                                allowFraction={true}
                                initialValue={extraMovieData?.data.rating}
                                size={22}
                                readonly
                                emptyColor="#404446"
                                fillColor="#EF4444"
                            />
                            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                {extraMovieData?.data.rating
                                    ? Number(
                                          extraMovieData?.data.rating
                                      ).toFixed(1)
                                    : 0}
                            </p>
                        </div>
                        <MovieStats
                            ratings={extraMovieData?.data.numberOfRatings}
                            likeCount={extraMovieData?.data.likeCount}
                            listCount={extraMovieData?.data.listCount}
                            watchedCount={extraMovieData?.data.watchedCount}
                        />
                    </div>
                    <div className="mt-5 space-y-4 pl-7">
                        <p className="font-semibold text-slate-800 dark:text-slate-400">
                            {movieData.tagline}
                        </p>
                        <p className="w-[90%] text-sm text-slate-700 dark:text-slate-300">
                            {movieData.overview}
                        </p>
                        <div className="pt-[5%]">
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
