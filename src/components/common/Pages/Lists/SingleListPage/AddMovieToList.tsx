import { MovieSearchResults } from "@/components/common/CreateReviewModal/CreateReviewModal";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IMovieFetch,
    type IMovie,
    movieFetchSchema,
} from "@/server/api/schemas/movie";
import { api } from "@/utils/api";
import clxsm from "@/utils/clsxm";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { useCallback, useEffect, useState } from "react";
import { BsArrowLeft, BsPlus } from "react-icons/bs";
import type { ZodType } from "zod";
import Image from "next/image";
import toast from "react-hot-toast";

const AddMovieToList = ({ listId }: { listId: string }) => {
    const [chosenMovie, setChosenMovie] = useState<IMovie>();
    const [movieFetchData, setMovieFetchData] = useState<IMovieFetch[]>([]);
    const [blockInput, setBlockInput] = useState<boolean>(false);

    const [searchText, setSearchText] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const trpcUtils = api.useContext();

    const { mutate: createMovieMutate } = api.movie.createFilm.useMutation();
    const { mutate, isLoading: addingLoading } =
        api.list.addEntryToList.useMutation({
            onSuccess: async () => {
                await trpcUtils.list.invalidate();
                setChosenMovie(undefined);
                setModalOpen(false);
                setBlockInput(false);
                toast.success(`Added ${chosenMovie?.title} to your list!`, {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
            },
            onError: () => {
                toast.error(
                    `Movie is already part of your list, try add a different movie!`,
                    {
                        position: "bottom-center",
                        duration: 4000,
                        className: "dark:bg-brand dark:text-white text-black",
                    }
                );
            },
        });

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
        setMovieFetchData([]);
        setSearchText("");
        setBlockInput(true);
    };

    const handleCancel = () => {
        setChosenMovie(undefined);
        setSearchText("");
        setBlockInput(false);
    };

    const handleAddMovieToList = () => {
        if (chosenMovie) {
            createMovieMutate({
                ...chosenMovie,
            });
            mutate({
                listId,
                movieId: chosenMovie.movieId,
            });
        }
    };

    return (
        <>
            <Modal open={modalOpen} onOpenChange={setModalOpen}>
                <Modal.Trigger styling={false}>
                    <div
                        className={clxsm([
                            "flex h-full w-full items-center justify-center rounded-md border-[1px]",
                            "border-slate-400 bg-brand-white text-center dark:border-slate-700 dark:bg-brand",
                            "cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800",
                        ])}
                    >
                        <BsPlus className="mx-auto my-auto h-20 w-20 fill-slate-500 dark:fill-slate-400" />
                    </div>
                </Modal.Trigger>
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
                            onClick={() => handleAddMovieToList()}
                            loading={addingLoading}
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
                </Modal.Content>
            </Modal>
        </>
    );
};

export default AddMovieToList;
