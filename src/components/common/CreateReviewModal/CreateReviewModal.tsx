import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IMovie,
    type IMovieFetch,
    movieFetchSchema,
    movieDetailsFetchSchema,
    type IMovieDetails,
} from "@/server/api/schemas/movie";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { type SetStateType } from "@/utils/types/helpers";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BsArrowLeft, BsFillXCircleFill } from "react-icons/bs";
import { Rating } from "react-simple-star-rating";
import DatePicker from "@/components/ui/DatePicker/DatePicker";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { type ZodType } from "zod";
import clxsm from "@/utils/clsxm";
import InputTags from "../Tags/InputTags";

interface CreateReviewModalProps {
    movie?: IMovie;
    size?: string;
    fromMenu?: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const CreateReviewModal = ({
    movie,
    size,
    fromMenu,
    open,
    setOpen,
}: CreateReviewModalProps) => {
    const [searchedMovieName, setSearchedMovieName] = useState<string>("");
    const [chosenMovieDetails, setChosenMovieDetails] = useState<IMovie | null>(
        null
    );
    const [extraMovieDetails, setExtraMovieDetails] =
        useState<IMovieDetails | null>(null);
    const [movieFetchData, setMovieFetchData] = useState<IMovieFetch[]>([]);

    const [reviewText, setReviewText] = useState<string>("");
    const [tags, setTags] = useState<Array<string>>([]);
    const [ratingValue, setRatingValue] = useState<number>(0);

    const [blockInput, setBlockInput] = useState<boolean>(false);
    const [watchedOnChecked, setWatchedOnChecked] = useState<boolean>(true);
    const [rewatchChecked, setRewatchChecked] = useState<boolean>(false);
    const [spoilerChecked, setSpoilerChecked] = useState<boolean>(false);
    const [reviewStarted, setReviewStarted] = useState<boolean>(false);

    const [watchedOnDate, setWatchedOnDate] = useState<Date | undefined>(
        new Date()
    );

    const trpcUtils = api.useContext();
    const { mutate: filmMutate, isLoading: filmLoading } =
        api.movie.createFilm.useMutation();
    const {
        mutateAsync: reviewMutate,
        isLoading: reviewLoading,
        isSuccess: reviewSuccess,
    } = api.review.createReview.useMutation();
    const {
        mutateAsync: watchedMutate,
        isLoading: watchedLoading,
        isSuccess: watchedSuccess,
    } = api.watched.createWatched.useMutation({
        onSuccess: () => {
            void trpcUtils.movie.movie.invalidate();
        },
    });

    const fetchMoviesFromSearchTerm = useCallback(async () => {
        if (searchedMovieName !== "") {
            const data = await fetchWithZod(
                `https://api.themoviedb.org/3/search/movie?query=${searchedMovieName}&include_adult=false&language=en-US&append_to_response=runtime'`,
                movieFetchSchema as ZodType
            );
            setMovieFetchData(data);
        } else setMovieFetchData([]);
    }, [searchedMovieName]);

    const fetchExtraDetailsAboutMovie = useCallback(async () => {
        if (chosenMovieDetails?.movieId) {
            const data = await fetchWithZod(
                `https://api.themoviedb.org/3/movie/${chosenMovieDetails.movieId}?language=en-US`,
                movieDetailsFetchSchema as ZodType
            );
            setExtraMovieDetails(data);
        } else setExtraMovieDetails(null);
    }, [chosenMovieDetails]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            void fetchMoviesFromSearchTerm();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [fetchMoviesFromSearchTerm, searchedMovieName]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            void fetchExtraDetailsAboutMovie();
        }, 100);

        return () => clearTimeout(delaySearch);
    }, [chosenMovieDetails, fetchExtraDetailsAboutMovie]);

    const handleFilmSelect = (movie: IMovie) => {
        setChosenMovieDetails(movie);
        setMovieFetchData([]);
        setSearchedMovieName("");
        setBlockInput(true);
    };

    const handleCancel = () => {
        setChosenMovieDetails(null);
        setReviewText("");
        setRatingValue(0);
        setTags([]);
        setSpoilerChecked(false);
        setBlockInput(false);
        setRewatchChecked(false);
    };

    const handleCreateReview = async () => {
        if (chosenMovieDetails) {
            filmMutate({
                ...chosenMovieDetails,
                fromReview: true,
                rating: parseFloat(ratingValue.toString()),
            });

            if (reviewText) {
                const review = await reviewMutate({
                    tags: tags.join(","),
                    containsSpoilers: spoilerChecked,
                    watchedOn: watchedOnDate!.toISOString(),
                    moviePoster: chosenMovieDetails.poster,
                    movieReleaseYear: chosenMovieDetails.releaseDate,
                    movieTitle: chosenMovieDetails.title,
                    ratingGiven: ratingValue,
                    text: reviewText,
                    ...chosenMovieDetails,
                });
                await watchedMutate({
                    ratingGiven: ratingValue,
                    movieTitle: chosenMovieDetails.title,
                    movieId: chosenMovieDetails.movieId,
                    poster: chosenMovieDetails.poster,
                    runtime: extraMovieDetails?.runtime ?? 0,
                    rewatch: rewatchChecked,
                    withReview: Boolean(reviewText) || reviewText !== "",
                    reviewLink: review.id,
                });
            } else {
                await watchedMutate({
                    ratingGiven: ratingValue,
                    movieTitle: chosenMovieDetails.title,
                    movieId: chosenMovieDetails.movieId,
                    poster: chosenMovieDetails.poster,
                    runtime: extraMovieDetails?.runtime ?? 0,
                    rewatch: rewatchChecked,
                    withReview: Boolean(reviewText) || reviewText !== "",
                });
            }
        }

        if (reviewText && reviewSuccess) {
            toast(
                (t) => (
                    <span>
                        Created review for {chosenMovieDetails?.title}!{" "}
                        <Link
                            className="underline"
                            href={"/"}
                            onClick={() => toast.dismiss(t.id)}
                        >
                            View
                        </Link>
                    </span>
                ),
                {
                    icon: "✅",
                    duration: 4000,
                    position: "bottom-center",
                    className: "dark:bg-brand-light dark:text-white text-black",
                }
            );
        } else if (watchedSuccess) {
            toast.success(
                `Added ${chosenMovieDetails?.title} to your watched!`,
                {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                }
            );
        }
        handleCancel();
        setOpen(false);
        return;
    };

    useEffect(() => {
        if (reviewText !== "") setReviewStarted(true);
        else setReviewStarted(false);
    }, [reviewText]);

    useEffect(() => {
        if (movie) {
            setChosenMovieDetails(movie);
            setBlockInput(true);
        } else {
            setBlockInput(false);
        }
    }, [movie]);

    return (
        <>
            <Modal open={open} onOpenChange={setOpen}>
                {!fromMenu && (
                    <Modal.Trigger>
                        <p className={clxsm(size ? `text-${size}` : "")}>
                            Create a review
                        </p>
                    </Modal.Trigger>
                )}
                <Modal.Content title="Create a review">
                    {!blockInput && !chosenMovieDetails ? (
                        <Input
                            className="mb-[10px] w-[25vw]"
                            value={searchedMovieName}
                            onChange={(e) =>
                                setSearchedMovieName(e.target.value)
                            }
                            placeholder="Search for a film"
                        />
                    ) : null}
                    {movieFetchData.length > 0 && (
                        <div className="max-h-[600px] overflow-y-auto pt-[10px]">
                            <MovieSearchResults
                                filmSearchResults={movieFetchData}
                                handleMovieClick={handleFilmSelect}
                            />
                        </div>
                    )}
                    {chosenMovieDetails && (
                        <SelectedFilmForm
                            handleCancel={handleCancel}
                            movie={chosenMovieDetails}
                            reviewText={reviewText}
                            setReviewText={setReviewText}
                            setRatingValue={setRatingValue}
                            ratingValue={ratingValue}
                            spoilerChecked={spoilerChecked}
                            handleSpoiler={() =>
                                setSpoilerChecked(!spoilerChecked)
                            }
                            tags={tags}
                            setTags={setTags}
                            watchedOnChecked={watchedOnChecked}
                            handleWatchedOnCheck={() =>
                                setWatchedOnChecked(!watchedOnChecked)
                            }
                            rewatchChecked={rewatchChecked}
                            handleRewatchChecked={() =>
                                setRewatchChecked(!rewatchChecked)
                            }
                            reviewStarted={reviewStarted}
                            watchedOnDate={watchedOnDate}
                            setWatchedOnDate={setWatchedOnDate}
                        />
                    )}
                    {filmLoading || (reviewLoading && <p>loading</p>)}
                    {blockInput && (
                        <div className="flex-end float-right space-x-2">
                            <Button
                                onClick={() => void handleCreateReview()}
                                loading={
                                    filmLoading ||
                                    reviewLoading ||
                                    watchedLoading
                                }
                            >
                                Save
                            </Button>
                            <Button
                                intent="outline"
                                onClick={() => {
                                    handleCancel();
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </Modal.Content>
            </Modal>
        </>
    );
};

export default CreateReviewModal;

interface MovieSearchResultsProps {
    filmSearchResults: IMovie[];
    handleMovieClick: (film: IMovie) => void;
}

export const MovieSearchResults = ({
    filmSearchResults,
    handleMovieClick,
}: MovieSearchResultsProps) => {
    return (
        <div className={clxsm("mt-5 h-max w-full columns-4 gap-4")}>
            {filmSearchResults?.slice(0, 10).map((movie: IMovie) => (
                <div
                    key={movie.movieId}
                    className={clxsm("break-inside-avoid-column pb-5")}
                    onClick={() => handleMovieClick(movie)}
                >
                    <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                        {movie.poster ? (
                            <Image
                                className="rounded-md"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: "100%", height: "auto" }}
                                alt={`${movie.title}`}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                            />
                        ) : (
                            <div className="mb-5 mt-5 text-center">?</div>
                        )}
                        <div className="p-2">
                            <p className="overflow-hidden text-ellipsis text-sm font-semibold text-crumble-base group-hover:text-crumble-base">
                                {movie.releaseDate.slice(0, 4)}
                            </p>
                            <p className="overflow-hidden text-ellipsis text-sm text-sky-lighter group-hover:text-crumble-base">
                                {movie.title}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const MovieSearchResultsMini = ({
    filmSearchResults,
    handleMovieClick,
}: MovieSearchResultsProps) => {
    return (
        <div className="relative z-50 my-2 mb-2 flex w-full rounded-md border bg-brand p-2 dark:border-slate-800">
            <div className={clxsm("h-max w-full columns-4 gap-4")}>
                {filmSearchResults?.slice(0, 10).map((movie: IMovie) => (
                    <div
                        key={movie.movieId}
                        className={clxsm("break-inside-avoid-column pb-5")}
                        onClick={() => handleMovieClick(movie)}
                    >
                        <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                            {movie.poster ? (
                                <Image
                                    className="rounded-md"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: "100%", height: "auto" }}
                                    alt={`${movie.title}`}
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                />
                            ) : (
                                <div className="mb-5 mt-5 text-center">?</div>
                            )}
                            <div className="p-2">
                                <p className="overflow-hidden text-ellipsis text-sm font-semibold text-crumble-base group-hover:text-crumble-base">
                                    {movie.releaseDate.slice(0, 4)}
                                </p>
                                <p className="overflow-hidden text-ellipsis text-sm text-sky-lighter group-hover:text-crumble-base">
                                    {movie.title}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface SelectedFilmFormProps {
    movie: IMovie;
    handleCancel: () => void;
    reviewText: string;
    setReviewText: SetStateType<string>;
    setRatingValue: SetStateType<number>;
    ratingValue: number;
    spoilerChecked: boolean;
    handleSpoiler: () => void;
    tags: Array<string>;
    setTags: SetStateType<Array<string>>;
    watchedOnChecked: boolean;
    handleWatchedOnCheck: () => void;
    rewatchChecked: boolean;
    handleRewatchChecked: () => void;
    reviewStarted: boolean;
    watchedOnDate: Date | undefined;
    setWatchedOnDate: SetStateType<Date | undefined>;
}

const SelectedFilmForm = ({
    movie,
    handleCancel,
    watchedOnChecked,
    handleWatchedOnCheck,
    rewatchChecked,
    handleRewatchChecked,
    reviewText,
    setReviewText,
    reviewStarted,
    tags,
    setTags,
    setRatingValue,
    ratingValue,
    spoilerChecked,
    handleSpoiler,
    watchedOnDate,
    setWatchedOnDate,
}: SelectedFilmFormProps) => {
    const [addToDiary, setAddToDiary] = useState<boolean>(false);

    useEffect(() => {
        setAddToDiary(watchedOnChecked);
    }, [watchedOnChecked]);

    return (
        <div>
            <Button intent="primary" onClick={() => handleCancel()}>
                <BsArrowLeft className="mr-1 mt-[2px]" />
                Back
            </Button>
            <div className="mt-5 block p-5 lg:flex">
                <Image
                    alt={movie.title}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="mr-5 aspect-auto rounded-lg"
                    style={{ height: "200px", width: "120px" }}
                />
                <div className="mt-2 w-[100%] text-left lg:ml-5">
                    <div className="mb-5 flex h-max w-[100%]">
                        <h2>
                            {movie.title}{" "}
                            <span className="mt-[7px] text-lg text-crumble">
                                {movie.releaseDate.slice(0, 4)}
                            </span>
                        </h2>
                    </div>
                    {watchedOnChecked ? (
                        <div className="space-y-4 md:flex md:space-x-5 md:space-y-0">
                            <div className="flex space-x-2">
                                <Checkbox
                                    checked={watchedOnChecked}
                                    onChange={handleWatchedOnCheck}
                                />
                                <p>Watched on</p>
                                <div className="-mt-1 md:-mt-[1px]">
                                    <DatePicker
                                        dateValue={watchedOnDate!}
                                        selectDateValue={setWatchedOnDate}
                                        buttonText={
                                            watchedOnDate
                                                ?.toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                .replace(/ /g, " ") ??
                                            "Watched date"
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Checkbox
                                    checked={rewatchChecked}
                                    onChange={handleRewatchChecked}
                                />
                                <p>Ive watched this film before</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <Checkbox
                                checked={addToDiary}
                                onChange={() => {
                                    setAddToDiary(!addToDiary);
                                    handleWatchedOnCheck();
                                }}
                            />
                            <p>Add film to diary?</p>
                        </div>
                    )}
                    <div className="mt-5 h-[200px] w-full">
                        <InputArea
                            fullWidth
                            className="h-[170px]"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your thoughts"
                        />
                    </div>
                    <div className="lg-space-y-0 space-y-4 lg:flex lg:space-x-10">
                        <InputTags
                            reviewStarted={reviewStarted}
                            tags={tags}
                            setTags={setTags}
                            placeholder="Review tags (press enter)"
                        />
                        <div>
                            <p className="text-sm">Rating</p>
                            <div className="mt-2 flex">
                                <Rating
                                    emptyStyle={{ display: "flex" }}
                                    fillStyle={{
                                        display: "-webkit-inline-box",
                                    }}
                                    allowFraction={true}
                                    initialValue={ratingValue}
                                    emptyColor="#303437"
                                    size={25}
                                    fillColor="#EF4444"
                                    onClick={setRatingValue}
                                />
                                {ratingValue > 0 && (
                                    <BsFillXCircleFill
                                        onClick={() => setRatingValue(0)}
                                        className="cursor float-right ml-2 mt-[5px] h-5 w-5 cursor-pointer"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <Checkbox
                            label="Contains spoilers"
                            disabled={!reviewStarted}
                            checked={spoilerChecked}
                            onChange={handleSpoiler}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
