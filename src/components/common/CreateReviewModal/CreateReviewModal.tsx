import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IMovie,
    type IMovieFetch,
    movieFetchSchema,
} from "@/server/api/schemas/movie";
import { zodFetch } from "@/utils/fetch/zodFetch";
import { type SetStateType } from "@/utils/types/helpers";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { BsArrowLeft, BsFillXCircleFill } from "react-icons/bs";
import { BiX } from "react-icons/bi";
import { Rating } from "react-simple-star-rating";
import DatePicker from "@/components/ui/DatePicker/DatePicker";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface CreateReviewModalProps {
    movie?: IMovie;
}

const CreateReviewModal = ({}: CreateReviewModalProps) => {
    // const router = useRouter();

    const [searchedMovieName, setSearchedMovieName] = useState<string>("");
    const [chosenMovieDetails, setChosenMovieDetails] = useState<IMovie | null>(
        null
    );
    const [movieFetchData, setMovieFetchData] = useState<IMovieFetch[]>([]);

    const [reviewText, setReviewText] = useState<string>("");
    const [tags, setTags] = useState<Array<string>>([]);
    const [ratingValue, setRatingValue] = useState<number>(0);

    const [blockInput, setBlockInput] = useState<boolean>(false);
    const [watchedOnChecked, setWatchedOnChecked] = useState<boolean>(true);
    const [rewatchChecked, setRewatchChecked] = useState<boolean>(false);
    const [spoilerChecked, setSpoilerChecked] = useState<boolean>(false);
    const [reviewStarted, setReviewStarted] = useState<boolean>(false);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [watchedOnDate, setWatchedOnDate] = useState<Date | undefined>(
        new Date()
    );

    const { mutate: filmMutate, isLoading: filmLoading } =
        api.movie.createFilm.useMutation();
    const {
        mutate: reviewMutate,
        isLoading: reviewLoading,
        isSuccess: reviewSuccess,
        isError: reviewError,
    } = api.review.createReview.useMutation();
    const {
        mutate: watchedMutate,
        isLoading: watchedLoading,
        isSuccess: watchedSuccess,
        isError: watchedError,
    } = api.watched.createWatched.useMutation();

    const fetchMoviesFromSearchTerm = useCallback(async () => {
        if (searchedMovieName !== "") {
            setMovieFetchData(
                await zodFetch<typeof movieFetchSchema>(
                    `https://api.themoviedb.org/3/search/movie?query=${searchedMovieName}&include_adult=false&language=en-US'`,
                    movieFetchSchema
                )
            );
        } else setMovieFetchData([]);
    }, [searchedMovieName]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            void fetchMoviesFromSearchTerm();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [fetchMoviesFromSearchTerm, searchedMovieName]);

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

    const handleCreateReview = () => {
        if (chosenMovieDetails) {
            filmMutate(chosenMovieDetails);
            watchedMutate({
                ratingGiven: ratingValue,
                movieTitle: chosenMovieDetails.title,
                movieId: chosenMovieDetails.movieId,
                poster: chosenMovieDetails.poster,
            });
            if (reviewText) {
                reviewMutate({
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
                    className: "dark:bg-brand-light dark:text-white text-black",
                }
            );
        }
        handleCancel();
        setModalOpen(false);
        return;
    };

    useEffect(() => {
        if (reviewText !== "") setReviewStarted(true);
        else setReviewStarted(false);
    }, [reviewText]);

    return (
        <>
            <Modal open={modalOpen} onOpenChange={setModalOpen}>
                <Modal.Trigger>Create a review</Modal.Trigger>
                <Modal.Content title="Create a review">
                    {!blockInput ? (
                        <Input
                            className="mb-[10px] w-[25vw]"
                            value={searchedMovieName}
                            change={setSearchedMovieName}
                            placeholder="Search for a film"
                        />
                    ) : null}
                    {movieFetchData.length > 0 && (
                        <div className="max-h-[600px] overflow-y-auto pt-[10px]">
                            <FilmSearchResults
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
                                onClick={() => handleCreateReview()}
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
                                    setModalOpen(false);
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

interface FilmSearchResultsProps {
    filmSearchResults: IMovie[];
    handleMovieClick: (film: IMovie) => void;
}

const FilmSearchResults = ({
    filmSearchResults,
    handleMovieClick,
}: FilmSearchResultsProps) => {
    return (
        <div className="mt-5 h-max w-full columns-4 gap-4">
            {filmSearchResults?.slice(0, 10).map((movie: IMovie) => (
                <div
                    key={movie.movieId}
                    className=" break-inside-avoid-column pb-5"
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
            <div className="mt-5 flex p-5">
                <Image
                    alt={movie.title}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="mr-5 aspect-auto rounded-lg"
                    style={{ width: "20%", height: "200px" }}
                />
                <div className="ml-5 w-[100%] text-left">
                    <div className="mb-5 flex h-max w-[100%]">
                        <h2 className="text-white">{movie.title}</h2>
                        <h3 className="ml-2 mt-1 text-crumble">
                            {movie.releaseDate.slice(0, 4)}
                        </h3>
                    </div>
                    {watchedOnChecked ? (
                        <div className="flex space-x-5">
                            <div className="flex space-x-2">
                                <Checkbox
                                    checked={watchedOnChecked}
                                    onChange={handleWatchedOnCheck}
                                />
                                <p>Watched on</p>
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
                            change={setReviewText}
                            placeholder="Write your thoughts"
                        />
                    </div>
                    <div className="flex space-x-10">
                        <Tags
                            reviewStarted={reviewStarted}
                            tags={tags}
                            setTags={setTags}
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

interface TagsProps {
    tags: string[];
    setTags: SetStateType<string[]>;
    reviewStarted: boolean;
}

const Tags = ({ tags, setTags, reviewStarted }: TagsProps) => {
    const [tag, setTag] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter") {
            if (!tags.includes(tag) && tags.length < 4 && tag !== "") {
                setTags([...tags, tag]);
                setTag("");
            } else {
                setTag("");
            }
        }
    };

    useEffect(() => {
        if (tags.length >= 4) setDisabled(true);
        else setDisabled(false);
    }, [tags]);

    const removeTag = (tag: string) => {
        setTags(tags.filter((item) => item !== tag));
    };

    return (
        <div>
            <p className="mb-2 text-sm">Tags</p>
            <div>
                <Input
                    value={tag}
                    disabled={disabled || !reviewStarted}
                    placeholder="Review tags (hit enter)"
                    type="text"
                    onKeyDown={handleKeyDown}
                    change={setTag}
                />
            </div>
            <div className="mt-3 flex w-[100%]">
                {tags.length > 0 &&
                    tags.map((tag: string, i: number) => (
                        <div
                            key={i}
                            className="mr-4 flex cursor-pointer rounded-lg border-[1px] border-ink-darker bg-ink-darkest p-2"
                            onClick={() => removeTag(tag)}
                        >
                            <p className="flex text-xs">{tag}</p>
                            <BiX className="ml-1 inline fill-crumble" />
                        </div>
                    ))}
            </div>
        </div>
    );
};
