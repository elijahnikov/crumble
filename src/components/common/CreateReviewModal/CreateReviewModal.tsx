import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IFilm,
    type IFilmFetch,
    filmFetchSchema,
} from "@/server/api/schemas/film";
import { zodFetch } from "@/utils/fetch/zodFetch";
import { SetStateType } from "@/utils/types/helpers";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    ChangeEvent,
    ChangeEventHandler,
    useCallback,
    useEffect,
    useState,
} from "react";
import { BsArrowLeft } from "react-icons/bs";

interface CreateReviewModalProps {
    film?: IFilm;
}

const CreateReviewModal = ({ film }: CreateReviewModalProps) => {
    const router = useRouter();

    const [searchedMovieName, setSearchedMovieName] = useState<string>("");
    const [chosenMovieDetails, setChosenMovieDetails] = useState<IFilm | null>(
        null
    );
    const [movieFetchData, setMovieFetchData] = useState<IFilmFetch[]>([]);

    const [reviewText, setReviewText] = useState<string>("");
    const [tags, setTags] = useState<Array<string>>([]);
    const [selectedMovieVisible, setSelectedMovieVisible] =
        useState<boolean>(false);
    const [ratingValue, setRatingValue] = useState<number>(0);

    const [blockInput, setBlockInput] = useState<boolean>(false);
    const [watchedOnChecked, setWatchedOnChecked] = useState<boolean>(true);
    const [rewatchChecked, setRewatchChecked] = useState<boolean>(false);
    const [spoilerChecked, setSpoilerChecked] = useState<boolean>(false);
    const [reviewStarted, setReviewStarted] = useState<boolean>(false);

    const [watchedOnDate, setWatchedOnDate] = useState<Date>(new Date());

    const fetchMoviesFromSearchTerm = useCallback(async () => {
        if (searchedMovieName !== "") {
            setMovieFetchData(
                await zodFetch<typeof filmFetchSchema>(
                    `https://api.themoviedb.org/3/search/movie?query=${searchedMovieName}&include_adult=false&language=en-US'`,
                    filmFetchSchema
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

    const handleFilmSelect = (film: IFilm) => {
        setChosenMovieDetails(film);
        setMovieFetchData([]);
        setSearchedMovieName("");
        setBlockInput(true);
    };

    const handleCancel = () => {
        setChosenMovieDetails(null);
        setBlockInput(false);
    };

    return (
        <>
            <Modal>
                <Modal.Trigger>Create a review</Modal.Trigger>
                <Modal.Content title="Create a review">
                    {!blockInput ? (
                        <Input
                            className="w-[25vw]"
                            value={searchedMovieName}
                            change={setSearchedMovieName}
                            placeholder="Search for a film"
                        />
                    ) : null}
                    {movieFetchData.length > 0 && (
                        <FilmSearchResults
                            filmSearchResults={movieFetchData}
                            handleMovieClick={handleFilmSelect}
                        />
                    )}
                    {chosenMovieDetails && (
                        <SelectedFilmForm
                            handleCancel={handleCancel}
                            film={chosenMovieDetails}
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
                </Modal.Content>
            </Modal>
        </>
    );
};

export default CreateReviewModal;

interface FilmSearchResultsProps {
    filmSearchResults: IFilm[];
    handleMovieClick: (film: IFilm) => void;
}

const FilmSearchResults = ({
    filmSearchResults,
    handleMovieClick,
}: FilmSearchResultsProps) => {
    return (
        <div className="mt-5 w-full columns-4 gap-4">
            {filmSearchResults?.slice(0, 10).map((film: IFilm) => (
                <div
                    key={film.filmId}
                    className=" break-inside-avoid-column pb-5"
                    onClick={() => handleMovieClick(film)}
                >
                    <div className="column group flow-root cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                        {film.poster ? (
                            <Image
                                className="rounded-md"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: "100%", height: "auto" }}
                                alt={`${film.movieTitle}`}
                                src={`https://image.tmdb.org/t/p/w500${film.poster}`}
                            />
                        ) : (
                            <div className="mb-5 mt-5 text-center">?</div>
                        )}
                        <div className="p-2">
                            <p className="overflow-hidden text-ellipsis text-sm font-semibold text-crumble-base group-hover:text-crumble-base">
                                {film.releaseDate.slice(0, 4)}
                            </p>
                            <p className="overflow-hidden text-ellipsis text-sm text-sky-lighter group-hover:text-crumble-base">
                                {film.movieTitle}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

interface SelectedFilmFormProps {
    film: IFilm;
    handleCancel: () => void;
    reviewText: string;
    setReviewText: SetStateType<string>;
    setRatingValue: SetStateType<number>;
    ratingValue: number;
    spoilerChecked: boolean;
    handleSpoiler: SetStateType<boolean>;
    tags: Array<string>;
    setTags: SetStateType<Array<string>>;
    watchedOnChecked: boolean;
    handleWatchedOnCheck: () => void;
    rewatchChecked: boolean;
    handleRewatchChecked: () => void;
    reviewStarted: boolean;
    watchedOnDate: Date;
    setWatchedOnDate: SetStateType<Date>;
}

const SelectedFilmForm = ({
    film,
    handleCancel,
    watchedOnChecked,
    handleWatchedOnCheck,
    rewatchChecked,
    handleRewatchChecked,
    reviewText,
    setReviewText,
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
                    alt={film.movieTitle}
                    src={`https://image.tmdb.org/t/p/w500${film.poster}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="mr-5 rounded-lg"
                    style={{ width: "20%", height: "auto" }}
                />
                <div className="ml-5 w-[100%] bg-blue-400 text-left">
                    <div className="mb-5 flex h-max w-[100%]">
                        <h2 className="text-white">{film.movieTitle}</h2>
                        <h3 className="ml-2 mt-1 text-crumble">
                            {film.releaseDate.slice(0, 4)}
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
                                {/* <DatePicker
                                    className="bg-crumble-100 ml-1 mt-[-10px] inline w-[110px] rounded-md border-none"
                                    selected={watchedOnDate}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date: Date) =>
                                        setWatchedOnDate(date)
                                    }
                                /> */}
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
                    <div className="mt-5 w-full bg-red-400">
                        <InputArea
                            fullWidth
                            value={reviewText}
                            change={setReviewText}
                            placeholder="Write your thoughts"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
