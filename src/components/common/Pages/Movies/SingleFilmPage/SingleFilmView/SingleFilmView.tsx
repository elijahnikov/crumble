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
import useIsMobile from "@/utils/hooks/useIsMobile";
import clxsm from "@/utils/clsxm";
import Description from "./Description";

interface SingleFilmViewProps {
    movieData: z.infer<typeof movieDetailsFetchSchema>;
}

const SingleFilmView = ({ movieData }: SingleFilmViewProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const isMobile = useIsMobile(639);

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
                            className="h-[250px] rounded-lg object-cover opacity-40"
                            priority
                            style={{ width: "100%" }}
                        />
                    )}
                    <Image
                        width={170}
                        height={170}
                        className="absolute left-0 right-0 top-10 mx-auto -mb-[50px] rounded-md drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:bottom-0 sm:left-0 sm:ml-4"
                        src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`}
                        priority
                        alt="Profile picture"
                    />

                    <div className={clxsm(!isMobile && "flex")}>
                        {isMobile && (
                            <>
                                <div className="h-[20px]" />
                                <Description
                                    directors={directors.map(
                                        (director) => director.original_name
                                    )}
                                    isMobile={isMobile}
                                    overview={movieData.overview}
                                    releaseDate={movieData.release_date.slice(
                                        0,
                                        4
                                    )}
                                    tagline={movieData.tagline}
                                    title={movieData.original_title}
                                >
                                    <div className="mx-auto flex justify-center text-center">
                                        <TertiaryInfo
                                            imdbLink={movieData.imdb_id}
                                            tmdbLink={movieData.id}
                                            runtime={movieData.runtime}
                                        />
                                    </div>
                                </Description>
                            </>
                        )}
                        {/* STATS */}
                        <div className="mx-auto mb-[20px] flex justify-center text-center sm:justify-start">
                            <div
                                className={clxsm(
                                    "min-w-[200px] max-w-[200px] space-y-5 text-center",
                                    isMobile ? "mt-[20px]" : "mt-[60px]"
                                )}
                            >
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
                                                            movieId:
                                                                movieData.id,
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
                                            <Tooltip.Content>
                                                Share
                                            </Tooltip.Content>
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
                                        initialValue={
                                            extraMovieData?.data.rating
                                        }
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
                                    ratings={
                                        extraMovieData?.data.numberOfRatings
                                    }
                                    likeCount={extraMovieData?.data.likeCount}
                                    listCount={extraMovieData?.data.listCount}
                                    watchedCount={
                                        extraMovieData?.data.watchedCount
                                    }
                                />
                            </div>
                        </div>
                        {/* DESCRIPTION */}
                        {!isMobile && (
                            <Description
                                directors={directors.map(
                                    (director) => director.original_name
                                )}
                                isMobile={isMobile}
                                overview={movieData.overview}
                                releaseDate={movieData.release_date.slice(0, 4)}
                                tagline={movieData.tagline}
                                title={movieData.original_title}
                            >
                                <TertiaryInfo
                                    imdbLink={movieData.imdb_id}
                                    tmdbLink={movieData.id}
                                    runtime={movieData.runtime}
                                />
                            </Description>
                        )}
                    </div>
                </div>

                <MovieInfoTabs
                    isMobile={isMobile}
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
