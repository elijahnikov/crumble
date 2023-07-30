import Modal from "@/components/ui/Modal/Modal";
import {
    type IFilm,
    type IFilmFetch,
    filmFetchSchema,
} from "@/server/api/schemas/film";
import { fetchTyped } from "@/utils/fetch/fetchTypes";
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
                await fetchTyped(
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
                <Modal.Trigger>
                    <h1>Create review</h1>
                </Modal.Trigger>
                <Modal.Content>
                    <p>hello!</p>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default CreateReviewModal;
