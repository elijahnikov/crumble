import { api, type RouterOutputs } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsPlus, BsX } from "react-icons/bs";
import SearchAndAddMovieModal from "@/components/common/SearchAndAddMovieModal/SearchAndAddMovieModal";
import type { IMovie } from "@/server/api/schemas/movie";
import toast from "react-hot-toast";

type FavouriteMovieType = RouterOutputs["user"]["getFavouriteMoviesForUser"];

type PickedMovieEntry = Pick<
    FavouriteMovieType[number],
    "movieId" | "userId"
> & {
    movie: Pick<
        FavouriteMovieType[number]["movie"],
        "backdrop" | "movieId" | "overview" | "poster" | "releaseDate" | "title"
    >;
};

interface FavouriteMoviesEditableProps {
    user: NonNullable<RouterOutputs["user"]["getUserForSettings"]>;
    isMe?: boolean;
    data: FavouriteMovieType;
    setHasEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

const FavouriteMoviesEditable = ({ data }: FavouriteMoviesEditableProps) => {
    const [showAddMovieToFavouriteModal, setShowAddMovieToFavouriteModal] =
        useState<boolean>(false);

    const [favouriteMovies, setFavouriteMovies] =
        useState<Array<PickedMovieEntry>>(data);

    const trpcUtils = api.useContext();

    const { mutateAsync: add } = api.user.addToFavouriteMovies.useMutation({
        onSuccess: async () => {
            toast.success(`Successfully added to your favourite movies`, {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
            await trpcUtils.user.getFavouriteMoviesForUser.invalidate();
        },
        onError: async ({ message }) => {
            await trpcUtils.user.getFavouriteMoviesForUser.invalidate();
        },
    });

    const { mutate: remove } = api.user.deleteFromFavouriteMovies.useMutation({
        onSuccess: async () => {
            toast.success(`Successfully removed from your favourite movies.`, {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
            await trpcUtils.user.getFavouriteMoviesForUser.invalidate();
        },
    });

    const addMovie = async (movie: IMovie) => {
        try {
            await add({
                movieId: movie.movieId,
            });
        } catch (e) {
            console.error(e);
        }
        setShowAddMovieToFavouriteModal(false);
    };

    const deleteMovie = (movieId: number) => {
        remove({
            movieId,
        });
    };

    useEffect(() => {
        setFavouriteMovies(data);
    }, [data]);

    return (
        <>
            <SearchAndAddMovieModal
                open={showAddMovieToFavouriteModal}
                setOpen={setShowAddMovieToFavouriteModal}
                callback={(movie) => addMovie(movie!)}
            />
            <div>
                <div className="columns mt-5 flex w-full space-x-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                        const movie = favouriteMovies[index];

                        return (
                            <div
                                key={index}
                                className="w-full cursor-pointer rounded-md border-[1px] border-gray-200 dark:border-gray-800"
                            >
                                {movie ? (
                                    <div className="relative">
                                        <Image
                                            className="rounded-md"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                            }}
                                            alt={`${movie.movie.title}`}
                                            src={`https://image.tmdb.org/t/p/w500${movie.movie.poster}`}
                                        />
                                        {movie && (
                                            <div
                                                onClick={() =>
                                                    deleteMovie(movie.movieId)
                                                }
                                                className="absolute right-0 top-0 h-max w-max rounded-full bg-crumble"
                                            >
                                                <BsX className="fill-white" />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        onClick={() =>
                                            setShowAddMovieToFavouriteModal(
                                                true
                                            )
                                        }
                                        className="flex h-[170px] w-[100%] items-center justify-center rounded-md bg-brand-white dark:bg-brand"
                                    >
                                        <BsPlus className="mx-auto my-auto h-5 w-5 justify-center text-center sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default FavouriteMoviesEditable;
