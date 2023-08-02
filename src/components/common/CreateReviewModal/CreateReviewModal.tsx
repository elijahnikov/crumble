import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Modal from "@/components/ui/Modal/Modal";
import {
    type IFilm,
    type IFilmFetch,
    filmFetchSchema,
} from "@/server/api/schemas/film";
import { zodFetch } from "@/utils/fetch/zodFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CreateReviewModalProps {
    film?: IFilm;
}

const CreateReviewModal = ({ film }: CreateReviewModalProps) => {
    const router = useRouter();

    const [searchedMovieName, setSearchedMovieName] = useState<string>("");
    const [chosenMovieDetails, setChosenMovieDetails] = useState<
        IFilm | object
    >({});

    const [reviewText, setReviewText] = useState<string>("");
    const [movieFetchData, setMovieFetchData] = useState<IFilmFetch[]>([]);
    const [selectedMovieVisible, setSelectedMovieVisible] =
        useState<boolean>(false);
    const [blockInput, setBlockInput] = useState<boolean>(false);
    const [ratingValue, setRatingValue] = useState<boolean>(false);
    const [spoilerChecked, setSpoilerChecked] = useState<boolean>(false);

    const fetchMoviesFromSearchTerm = async () => {
        if (searchedMovieName !== "") {
            setMovieFetchData(
                await zodFetch<typeof filmFetchSchema>(
                    `https://api.themoviedb.org/3/search/movie?query=${searchedMovieName}&include_adult=false&language=en-US'`,
                    filmFetchSchema
                )
            );
        } else setMovieFetchData([]);
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            void fetchMoviesFromSearchTerm();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchedMovieName]);

    return (
        <>
            <Modal>
                <Modal.Trigger>Create a review</Modal.Trigger>
                <Modal.Content title="Create a review">
                    <Input
                        change={setSearchedMovieName}
                        placeholder="Search for a movie"
                    />
                    {/* {movieFetchData && JSON.stringify(movieFetchData)} */}
                </Modal.Content>
            </Modal>
        </>
    );
};

export default CreateReviewModal;
