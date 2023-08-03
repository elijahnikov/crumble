import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IFilm,
    type IFilmFetch,
    filmFetchSchema,
} from "@/server/api/schemas/film";
import { zodFetch } from "@/utils/fetch/zodFetch";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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

    const [reviewText, setReviewText] = useState<string>("");
    const [movieFetchData, setMovieFetchData] = useState<IFilmFetch[]>([]);
    const [selectedMovieVisible, setSelectedMovieVisible] =
        useState<boolean>(false);
    const [blockInput, setBlockInput] = useState<boolean>(false);
    const [ratingValue, setRatingValue] = useState<boolean>(false);
    const [spoilerChecked, setSpoilerChecked] = useState<boolean>(false);

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
                            fullWidth
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
}

const SelectedFilmForm = ({ film, handleCancel }: SelectedFilmFormProps) => {
    return (
        <>
            <div>
                <Button
                    className="ml-10"
                    intent="primary"
                    onClick={() => handleCancel()}
                >
                    <BsArrowLeft className="mr-1" />
                    Back
                </Button>
            </div>
        </>
    );
};
