import { MovieSearchResults } from "@/components/common/CreateReviewModal/CreateReviewModal";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IMovieFetch,
    type IMovie,
    movieFetchSchema,
} from "@/server/api/schemas/movie";
import clxsm from "@/utils/clsxm";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { useCallback, useEffect, useState } from "react";
import { BsArrowLeft, BsPlus } from "react-icons/bs";
import type { ZodType } from "zod";
import Image from "next/image";
import { api } from "@/utils/api";

interface SearchAndAddMovieModalProps {
    callback: (modal: IMovie | undefined) => Promise<void>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchAndAddMovieModal = ({
    callback,
    open,
    setOpen,
}: SearchAndAddMovieModalProps) => {
    const [chosenMovie, setChosenMovie] = useState<IMovie>();
    const [movieFetchData, setMovieFetchData] = useState<IMovieFetch[]>([]);
    const [blockInput, setBlockInput] = useState<boolean>(false);

    const [searchText, setSearchText] = useState<string>("");

    const { mutate: createMovie } = api.movie.createFilm.useMutation();

    const fetchMoviesFromSearchTerm = useCallback(async () => {
        if (searchText !== "") {
            const data = await fetchWithZod(
                `https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=en-US'`,
                movieFetchSchema as ZodType
            );
            setMovieFetchData(data);
        } else setMovieFetchData([]);
    }, [searchText]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            void fetchMoviesFromSearchTerm();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [fetchMoviesFromSearchTerm, searchText]);

    const handleFilmSelect = (movie: IMovie) => {
        setChosenMovie(movie);
        createMovie({
            ...movie,
        });
        setMovieFetchData([]);
        setSearchText("");
        setBlockInput(true);
    };

    const handleCancel = () => {
        setChosenMovie(undefined);
        setSearchText("");
        setBlockInput(false);
    };

    return (
        <>
            <Modal open={open} onOpenChange={setOpen}>
                <Modal.Content title="Add a movie to your list">
                    <div>
                        {!blockInput && (
                            <Input
                                className="mb-[10px] w-[25vw]"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search for a film"
                            />
                        )}
                    </div>
                    {movieFetchData.length > 0 && (
                        <div className="max-h-[600px] overflow-y-auto pt-[10px]">
                            <MovieSearchResults
                                filmSearchResults={movieFetchData}
                                handleMovieClick={handleFilmSelect}
                            />
                        </div>
                    )}
                    {chosenMovie && (
                        <div>
                            <Button
                                onClick={() => handleCancel()}
                                size="sm"
                                className="mb-4"
                                leftIcon={BsArrowLeft}
                            >
                                Back
                            </Button>
                            <div className="flex">
                                <Image
                                    alt={chosenMovie.title}
                                    src={`https://image.tmdb.org/t/p/w500${chosenMovie.poster}`}
                                    width={100}
                                    height={100}
                                    className="mr-5 aspect-auto rounded-lg"
                                />
                                <div className="ml-5 w-[100%] text-left">
                                    <div className="mb-2 flex h-max w-[100%]">
                                        <h2>
                                            {chosenMovie.title}{" "}
                                            <span className="mt-[7px] text-lg text-crumble">
                                                {chosenMovie.releaseDate.slice(
                                                    0,
                                                    4
                                                )}
                                            </span>
                                        </h2>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {chosenMovie.overview &&
                                        chosenMovie.overview.length > 200
                                            ? `${chosenMovie.overview?.slice(
                                                  0,
                                                  200
                                              )}...`
                                            : chosenMovie.overview}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex-end float-right space-x-2">
                        <Button
                            disabled={!chosenMovie}
                            onClick={() => {
                                setChosenMovie(undefined);
                                void callback(chosenMovie);
                            }}
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
                </Modal.Content>
            </Modal>
        </>
    );
};

export default SearchAndAddMovieModal;
