import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import Image from "next/image";
import Modal from "@/components/ui/Modal/Modal";
import {
    movieFetchSchema,
    type IMovie,
    type IMovieFetch,
} from "@/server/api/schemas/movie";
import clxsm from "@/utils/clsxm";
import { fetchWithZod } from "@/utils/fetch/zodFetch";

import { useCallback, useEffect, useState } from "react";
import type { ZodType } from "zod";
import InputTags from "../Tags/InputTags";
import { BsX } from "react-icons/bs";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface CreateListModalProps {
    size?: string;
    fromMenu?: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const CreateListModal = ({
    size,
    fromMenu,
    open,
    setOpen,
}: CreateListModalProps) => {
    const [listName, setListName] = useState<string>("");
    const [listDescription, setListDescription] = useState<string>("");
    const [tags, setTags] = useState<Array<string>>([]);

    const [searchedMovieName, setSearchedMovieName] = useState<string>("");
    const [chosenMovies, setChosenMovies] = useState<Array<IMovie>>([]);

    const [movieFetchData, setMovieFetchData] = useState<Array<IMovieFetch>>(
        []
    );

    // const [modalOpen, setModalOpen] = useState<boolean>(false);

    const { mutate: listMutate, isLoading: listLoading } =
        api.list.createList.useMutation({
            onSuccess: (list) => {
                toast(
                    (t) => {
                        return (
                            <span onClick={() => toast.dismiss(t.id)}>
                                Created your list! See it
                                <Link
                                    className="ml-1 underline"
                                    href={{
                                        pathname: "/list/[id]",
                                        query: {
                                            id: list.list.id,
                                        },
                                    }}
                                >
                                    here
                                </Link>
                            </span>
                        );
                    },
                    {
                        icon: "✅",
                        position: "bottom-center",
                        duration: 4000,
                        className: "dark:bg-brand dark:text-white text-black",
                    }
                );
            },
        });

    const { mutate: addMovieMutate } = api.movie.createManyMovie.useMutation();

    const fetchMoviesFromSearchTerm = useCallback(async () => {
        if (searchedMovieName !== "") {
            const data = await fetchWithZod(
                `https://api.themoviedb.org/3/search/movie?query=${searchedMovieName}&include_adult=false&language=en-US'`,
                movieFetchSchema as ZodType
            );
            setMovieFetchData(data);
        } else setMovieFetchData([]);
    }, [searchedMovieName]);

    const addMovieToChosen = (movie: IMovie) => {
        const duplicateCheck = chosenMovies.some(
            (m) => m.movieId === movie.movieId
        );

        if (!duplicateCheck) {
            setChosenMovies([...chosenMovies, movie]);
        }
        setSearchedMovieName("");
    };

    const removeMovie = (id: number) => {
        setChosenMovies(chosenMovies.filter((movie) => movie.movieId !== id));
    };

    const handleCreateList = () => {
        const movieIds: number[] = chosenMovies.map((movie) => movie.movieId);

        listMutate({
            title: listName,
            description: listDescription,
            tags: tags.join(","),
            posterPathOne: chosenMovies[0] ? chosenMovies[0].poster : undefined,
            posterPathTwo: chosenMovies[1] ? chosenMovies[1].poster : undefined,
            posterPathThree: chosenMovies[2]
                ? chosenMovies[2].poster
                : undefined,
            posterPathFour: chosenMovies[3]
                ? chosenMovies[3].poster
                : undefined,
            posterPathFive: chosenMovies[4]
                ? chosenMovies[4].poster
                : undefined,
            movieIds,
        });

        addMovieMutate(chosenMovies);

        setTimeout(() => {
            setOpen(false);
        }, 500);
    };

    useEffect(() => {
        let delayBounceFn: NodeJS.Timeout;
        if (searchedMovieName !== "") {
            delayBounceFn = setTimeout(() => {
                void fetchMoviesFromSearchTerm();
            }, 500);
        } else {
            setMovieFetchData([]);
        }
        return () => clearTimeout(delayBounceFn);
    }, [searchedMovieName, fetchMoviesFromSearchTerm]);

    return (
        <>
            <Modal open={open} onOpenChange={setOpen}>
                {!fromMenu && (
                    <Modal.Trigger>
                        <p className={clxsm(size ? `text-${size}` : "")}>
                            Create a list
                        </p>
                    </Modal.Trigger>
                )}
                <Modal.Content title="Create a new list">
                    <div>
                        <div className="flex-end float-right mb-5 space-x-2">
                            <Button
                                loading={listLoading}
                                onClick={() => handleCreateList()}
                            >
                                Save
                            </Button>
                            <Button intent="outline">Cancel</Button>
                        </div>
                        <div className="flex w-[100%] space-x-5">
                            <div className="w-[40%] space-y-2">
                                <Input
                                    placeholder="Name your list"
                                    autoFocus
                                    fullWidth
                                    value={listName}
                                    change={setListName}
                                    label="Name"
                                />
                                <InputTags
                                    placeholder="List tags (Press enter)"
                                    setTags={setTags}
                                    tags={tags}
                                    reviewStarted={true}
                                />
                            </div>
                            <div className="w-[60%]">
                                <InputArea
                                    placeholder="Describe your list with a few words..."
                                    fullWidth
                                    className="h-[150px]"
                                    label="Description"
                                    value={listDescription}
                                    change={setListDescription}
                                />
                            </div>
                        </div>
                        <div className="mt-5" />
                        <Input
                            label="Add movies"
                            fullWidth
                            value={searchedMovieName}
                            change={setSearchedMovieName}
                            placeholder="Search for a movie"
                        />
                        {movieFetchData.length > 0 && (
                            <div className="mt-3 max-h-[180px] overflow-y-auto rounded-md border-[1px] border-gray-300 p-2 pt-[10px] dark:border-brand-light">
                                <MovieResults
                                    movieFetchData={movieFetchData}
                                    handleMovieClick={addMovieToChosen}
                                />
                            </div>
                        )}
                        {chosenMovies.length > 0 && (
                            <div className="mt-10 max-h-[180px] overflow-y-auto rounded-md">
                                <ChosenMovies
                                    chosenMovies={chosenMovies}
                                    handleRemoveMovies={removeMovie}
                                />
                            </div>
                        )}
                    </div>
                </Modal.Content>
            </Modal>
        </>
    );
};

const MovieResults = ({
    movieFetchData,
    handleMovieClick,
}: {
    movieFetchData: Array<IMovieFetch>;
    handleMovieClick: (movie: IMovie) => void;
}) => {
    return (
        <div className="rows-6 h-max w-[97%]">
            {movieFetchData?.slice(0, 8).map((movie: IMovie) => (
                <div
                    key={movie.movieId}
                    className="break-inside-avoid-column pb-2"
                    onClick={() => handleMovieClick(movie)}
                >
                    <div className="group flex cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                        {movie.poster ? (
                            <Image
                                className="rounded-md"
                                width={30}
                                height={30}
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

const ChosenMovies = ({
    chosenMovies,
    handleRemoveMovies,
}: {
    chosenMovies: Array<IMovie>;
    handleRemoveMovies: (id: number) => void;
}) => {
    return (
        <div>
            <p className="mb-1 ml-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chosen movies
            </p>
            {chosenMovies.map((movie: IMovie) => (
                <div
                    key={movie.movieId}
                    className="break-inside-avoid-column pb-2"
                    onClick={() => handleRemoveMovies(movie.movieId)}
                >
                    <div className="group flex cursor-pointer rounded-md border-[1px] border-gray-300 dark:border-brand-light">
                        <div className="flex w-[95%] space-x-2 p-2">
                            <p className="overflow-hidden text-ellipsis text-sm text-sky-lighter group-hover:text-crumble-base">
                                {movie.title}
                            </p>
                            <p className="overflow-hidden text-ellipsis text-sm font-semibold text-crumble-base group-hover:text-crumble-base">
                                {movie.releaseDate.slice(0, 4)}
                            </p>
                        </div>
                        <div className="flex-end float-right my-auto justify-center text-center">
                            <BsX className="fill-crumble" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default CreateListModal;
